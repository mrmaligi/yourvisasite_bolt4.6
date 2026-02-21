-- Migration: Fix multiple database and API integration issues
-- Track: 038
-- Status: PENDING

-- ============================================================
-- 1. Fix saved_visas RLS
-- ============================================================
-- Ensure policies exist and are correct
DROP POLICY IF EXISTS "Users can read own saved visas" ON public.saved_visas;
DROP POLICY IF EXISTS "Users can save visas" ON public.saved_visas;
DROP POLICY IF EXISTS "Users can unsave visas" ON public.saved_visas;

ALTER TABLE public.saved_visas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved visas"
  ON public.saved_visas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save visas"
  ON public.saved_visas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave visas"
  ON public.saved_visas FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. Fix Bookings (Stripe Integration)
-- ============================================================
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT;

-- ============================================================
-- 3. Fix Tracker Stats (Materialized View + EWMA)
-- ============================================================
DROP MATERIALIZED VIEW IF EXISTS public.tracker_stats CASCADE;
DROP TABLE IF EXISTS public.tracker_stats CASCADE;

-- Create Materialized View with EWMA-like weighting (time decay)
-- Formula: Weighted Average where weight = 1 / (days_old + 1)
-- This gives higher weight to recent entries
CREATE MATERIALIZED VIEW public.tracker_stats AS
SELECT
  visa_id,
  COUNT(*) as total_entries,
  ROUND(AVG(processing_days)::numeric, 1) as avg_days,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY processing_days) as median_days,
  MIN(processing_days) as min_days,
  MAX(processing_days) as max_days,
  ROUND(
    (SUM(processing_days::numeric * (1.0 / (EXTRACT(EPOCH FROM (NOW() - created_at))/86400.0 + 1.0))) /
    NULLIF(SUM(1.0 / (EXTRACT(EPOCH FROM (NOW() - created_at))/86400.0 + 1.0)), 0))::numeric,
    1
  ) as ewma_days,
  NOW() as last_updated
FROM public.tracker_entries
GROUP BY visa_id;

CREATE UNIQUE INDEX idx_tracker_stats_visa_id ON public.tracker_stats(visa_id);

-- Function to refresh the view
CREATE OR REPLACE FUNCTION public.refresh_tracker_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.tracker_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh on changes
DROP TRIGGER IF EXISTS refresh_tracker_stats_trigger ON public.tracker_entries;
CREATE TRIGGER refresh_tracker_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.tracker_entries
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.refresh_tracker_stats();

-- ============================================================
-- 4. Fix Lawyer Profiles Visibility
-- ============================================================
ALTER TABLE lawyer.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to verified lawyer profiles (or all for listing)
DROP POLICY IF EXISTS "Public read access to verified lawyers" ON lawyer.profiles;
CREATE POLICY "Public read access to verified lawyers"
  ON lawyer.profiles FOR SELECT
  USING (true);

-- Also ensure public.lawyer_profiles has policies if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lawyer_profiles') THEN
      ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public read access" ON public.lawyer_profiles;
      CREATE POLICY "Public read access" ON public.lawyer_profiles FOR SELECT USING (true);
  END IF;
END $$;

-- ============================================================
-- 5. Fix User Documents Sharing
-- ============================================================
DO $$
BEGIN
  -- Try to add to documents
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documents') THEN
    ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS shared_with_lawyer_id UUID REFERENCES lawyer.profiles(id);

    -- Add policy for lawyers
    DROP POLICY IF EXISTS "Lawyers can view shared documents" ON public.documents;
    CREATE POLICY "Lawyers can view shared documents"
      ON public.documents FOR SELECT
      USING (
        shared_with_lawyer_id IN (
          SELECT id FROM lawyer.profiles WHERE profile_id = auth.uid()
        )
      );
  END IF;

  -- Try to add to user_documents (just in case it's the table name)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_documents') THEN
    ALTER TABLE public.user_documents ADD COLUMN IF NOT EXISTS shared_with_lawyer_id UUID REFERENCES lawyer.profiles(id);

    -- Add policy for lawyers
    DROP POLICY IF EXISTS "Lawyers can view shared documents" ON public.user_documents;
    CREATE POLICY "Lawyers can view shared documents"
      ON public.user_documents FOR SELECT
      USING (
        shared_with_lawyer_id IN (
          SELECT id FROM lawyer.profiles WHERE profile_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ============================================================
-- 6. Fix News RLS
-- ============================================================
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read news" ON public.news_articles;
CREATE POLICY "Public can read news"
  ON public.news_articles FOR SELECT
  USING (true);

-- ============================================================
-- 7. Create user_visa_purchases table (if missing)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_visa_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    visa_id UUID NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    amount_cents INTEGER,
    currency TEXT DEFAULT 'AUD',
    status TEXT DEFAULT 'active',
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, visa_id)
);

ALTER TABLE public.user_visa_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchases" ON public.user_visa_purchases;
CREATE POLICY "Users can view own purchases"
  ON public.user_visa_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- 8. Notifications Trigger
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see own notifications" ON public.notifications;
CREATE POLICY "Users can see own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Function to create notification
CREATE OR REPLACE FUNCTION public.handle_new_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_title TEXT;
  v_message TEXT;
  v_url TEXT;
BEGIN
  -- Handle Booking Status Changes
  IF TG_TABLE_NAME = 'bookings' THEN
    v_user_id := NEW.user_id;
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
      v_title := 'Booking Confirmed';
      v_message := 'Your consultation has been confirmed.';
      v_url := '/dashboard/consultations';
    ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
      v_title := 'Booking Cancelled';
      v_message := 'Your consultation has been cancelled.';
      v_url := '/dashboard/consultations';
    ELSE
      RETURN NEW;
    END IF;

  -- Handle Visa Purchases
  ELSIF TG_TABLE_NAME = 'user_visa_purchases' THEN
    v_user_id := NEW.user_id;
    v_title := 'Visa Guide Purchased';
    v_message := 'You have successfully purchased a premium guide.';
    v_url := '/dashboard/premium';
  END IF;

  -- Insert Notification
  INSERT INTO public.notifications (user_id, type, title, message, action_url)
  VALUES (v_user_id, 'info', v_title, v_message, v_url);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS trigger_notification_bookings ON public.bookings;
DROP TRIGGER IF EXISTS trigger_notification_purchases ON public.user_visa_purchases;

-- Create Triggers
CREATE TRIGGER trigger_notification_bookings
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_notification();

CREATE TRIGGER trigger_notification_purchases
  AFTER INSERT ON public.user_visa_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_notification();
