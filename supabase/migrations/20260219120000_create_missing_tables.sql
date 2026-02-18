/*
  # Create missing tables

  1. New Tables
    - `consultation_slots` (public schema)
    - `saved_visas` (public schema)
    - `marketplace_listings` (public schema)
    - `marketplace_reviews` (public schema)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read and authenticated management as specified

  3. Indexes
    - Add indexes for foreign keys for performance
*/

-- 1. consultation_slots
CREATE TABLE IF NOT EXISTS public.consultation_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultation_slots_lawyer ON public.consultation_slots(lawyer_id);

ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'consultation_slots' AND policyname = 'Public read consultation_slots'
    ) THEN
        CREATE POLICY "Public read consultation_slots"
          ON public.consultation_slots FOR SELECT
          USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'consultation_slots' AND policyname = 'Lawyers manage own slots'
    ) THEN
        CREATE POLICY "Lawyers manage own slots"
          ON public.consultation_slots FOR ALL
          USING (auth.uid() = lawyer_id)
          WITH CHECK (auth.uid() = lawyer_id);
    END IF;
END $$;


-- 2. saved_visas
CREATE TABLE IF NOT EXISTS public.saved_visas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_id uuid REFERENCES public.visas(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, visa_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_visas_visa ON public.saved_visas(visa_id);
-- idx_saved_visas_user is covered by the unique constraint (user_id, visa_id)

ALTER TABLE public.saved_visas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'saved_visas' AND policyname = 'Users manage own saved_visas'
    ) THEN
        CREATE POLICY "Users manage own saved_visas"
          ON public.saved_visas FOR ALL
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;


-- 3. marketplace_listings
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price_cents integer NOT NULL,
  category_id uuid REFERENCES public.marketplace_categories(id),
  visa_id uuid REFERENCES public.visas(id),
  file_url text,
  preview_url text,
  is_active boolean DEFAULT true,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_listings_lawyer ON public.marketplace_listings(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON public.marketplace_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_visa ON public.marketplace_listings(visa_id);

ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_listings' AND policyname = 'Public view active listings'
    ) THEN
        CREATE POLICY "Public view active listings"
          ON public.marketplace_listings FOR SELECT
          USING (is_active = true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_listings' AND policyname = 'Lawyers view own listings'
    ) THEN
        CREATE POLICY "Lawyers view own listings"
          ON public.marketplace_listings FOR SELECT
          USING (auth.uid() = lawyer_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_listings' AND policyname = 'Lawyers manage own listings'
    ) THEN
        CREATE POLICY "Lawyers manage own listings"
          ON public.marketplace_listings FOR ALL
          USING (auth.uid() = lawyer_id)
          WITH CHECK (auth.uid() = lawyer_id);
    END IF;
END $$;


-- 4. marketplace_reviews
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_listing ON public.marketplace_reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_user ON public.marketplace_reviews(user_id);

ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_reviews' AND policyname = 'Public read marketplace_reviews'
    ) THEN
        CREATE POLICY "Public read marketplace_reviews"
          ON public.marketplace_reviews FOR SELECT
          USING (true);
    END IF;

    -- Removed insecure 'Authenticated create marketplace_reviews' policy
    -- 'Users manage own reviews' covers authenticated creation with proper user_id check

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_reviews' AND policyname = 'Users manage own reviews'
    ) THEN
        CREATE POLICY "Users manage own reviews"
          ON public.marketplace_reviews FOR ALL
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
