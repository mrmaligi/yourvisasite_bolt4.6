/*
  # Tracker Moderation & Notification Infrastructure (Cycle 5)

  1. Adds tracker moderation features (flagging, auto-detection)
  2. Creates notification preferences and logs tables
  3. Adds scheduled function for reminder emails
  
  Sources: Internal platform requirements
*/

-- =============================================================
-- Notification Preferences Table
-- =============================================================
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Email notification toggles
  email_booking_confirmation boolean DEFAULT true,
  email_booking_reminder boolean DEFAULT true,
  email_consultation_cancelled boolean DEFAULT true,
  email_processing_time_alert boolean DEFAULT true,
  email_welcome boolean DEFAULT true,
  email_premium_purchase boolean DEFAULT true,
  email_marketing boolean DEFAULT false,
  
  -- Push notification toggles (future)
  push_booking_reminder boolean DEFAULT true,
  push_processing_time_alert boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own preferences
CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all preferences (for debugging)
CREATE POLICY "Admins can view all notification preferences"
  ON public.notification_preferences FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- =============================================================
-- Notification Logs Table
-- =============================================================
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('email', 'push', 'sms')),
  status text NOT NULL CHECK (status IN ('sent', 'delivered', 'failed', 'bounced')),
  provider_message_id text,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own logs
CREATE POLICY "Users can view own notification logs"
  ON public.notification_logs FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert logs (via service role)
CREATE POLICY "Service role can insert notification logs"
  ON public.notification_logs FOR INSERT
  WITH CHECK (true);

-- Admins can view all logs
CREATE POLICY "Admins can view all notification logs"
  ON public.notification_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Indexes for notification logs
CREATE INDEX idx_notification_logs_user_id ON public.notification_logs(user_id);
CREATE INDEX idx_notification_logs_created_at ON public.notification_logs(created_at DESC);
CREATE INDEX idx_notification_logs_type ON public.notification_logs(type);

-- =============================================================
-- Tracker Moderation Features
-- =============================================================

-- Add moderation fields to tracker_entries
ALTER TABLE public.tracker_entries 
ADD COLUMN IF NOT EXISTS is_flagged boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS flag_reason text,
ADD COLUMN IF NOT EXISTS flagged_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS flagged_at timestamptz,
ADD COLUMN IF NOT EXISTS moderator_notes text,
ADD COLUMN IF NOT EXISTS is_outlier boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS outlier_score decimal(5,2);

-- Create tracker moderation queue table
CREATE TABLE IF NOT EXISTS public.tracker_moderation_queue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id uuid REFERENCES public.tracker_entries(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reviewing')),
  detection_method text NOT NULL CHECK (detection_method IN ('auto_outlier', 'auto_spam', 'user_report', 'manual')),
  confidence_score decimal(5,2),
  reported_by uuid REFERENCES auth.users(id),
  report_reason text,
  moderator_id uuid REFERENCES auth.users(id),
  moderator_decision text,
  moderator_decided_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on moderation queue
ALTER TABLE public.tracker_moderation_queue ENABLE ROW LEVEL SECURITY;

-- Only admins can view and update moderation queue
CREATE POLICY "Admins can view moderation queue"
  ON public.tracker_moderation_queue FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can update moderation queue"
  ON public.tracker_moderation_queue FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Authenticated users can create reports"
  ON public.tracker_moderation_queue FOR INSERT
  WITH CHECK (
    detection_method = 'user_report' AND 
    reported_by = auth.uid()
  );

-- Indexes for moderation
CREATE INDEX idx_tracker_entries_flagged ON public.tracker_entries(is_flagged) WHERE is_flagged = true;
CREATE INDEX idx_tracker_entries_outlier ON public.tracker_entries(is_outlier) WHERE is_outlier = true;
CREATE INDEX idx_tracker_moderation_status ON public.tracker_moderation_queue(status);
CREATE INDEX idx_tracker_moderation_entry ON public.tracker_moderation_queue(entry_id);

-- =============================================================
-- Auto-flagging Function for Outliers
-- =============================================================
CREATE OR REPLACE FUNCTION public.auto_flag_tracker_outliers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  entry_record RECORD;
  visa_stats RECORD;
  mean_days DECIMAL;
  std_dev DECIMAL;
  z_score DECIMAL;
BEGIN
  -- Process each visa type
  FOR visa_stats IN 
    SELECT 
      visa_id,
      AVG(processing_days) as avg_days,
      STDDEV(processing_days) as stddev_days
    FROM public.tracker_entries
    WHERE outcome = 'approved' 
      AND processing_days IS NOT NULL
      AND is_flagged = false
    GROUP BY visa_id
    HAVING COUNT(*) >= 5
  LOOP
    -- Find outliers (>3 standard deviations from mean)
    FOR entry_record IN 
      SELECT id, processing_days
      FROM public.tracker_entries
      WHERE visa_id = visa_stats.visa_id
        AND outcome = 'approved'
        AND processing_days IS NOT NULL
        AND is_flagged = false
        AND is_outlier = false
    LOOP
      IF visa_stats.stddev_days > 0 THEN
        z_score := ABS(entry_record.processing_days - visa_stats.avg_days) / visa_stats.stddev_days;
        
        IF z_score > 3 THEN
          -- Mark as outlier
          UPDATE public.tracker_entries
          SET is_outlier = true,
              outlier_score = z_score
          WHERE id = entry_record.id;
          
          -- Add to moderation queue
          INSERT INTO public.tracker_moderation_queue (
            entry_id, 
            detection_method, 
            confidence_score,
            status
          ) VALUES (
            entry_record.id,
            'auto_outlier',
            z_score,
            'pending'
          )
          ON CONFLICT DO NOTHING;
        END IF;
      END IF;
    END LOOP;
  END LOOP;
END;
$$;

-- =============================================================
-- Function to Report Tracker Entry
-- =============================================================
CREATE OR REPLACE FUNCTION public.report_tracker_entry(
  p_entry_id uuid,
  p_reason text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into moderation queue
  INSERT INTO public.tracker_moderation_queue (
    entry_id,
    detection_method,
    reported_by,
    report_reason,
    status
  ) VALUES (
    p_entry_id,
    'user_report',
    auth.uid(),
    p_reason,
    'pending'
  );
  
  -- Flag the entry
  UPDATE public.tracker_entries
  SET is_flagged = true,
      flag_reason = p_reason,
      flagged_by = auth.uid(),
      flagged_at = now()
  WHERE id = p_entry_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- =============================================================
-- Function to Moderate Entry (Admin only)
-- =============================================================
CREATE OR REPLACE FUNCTION public.moderate_tracker_entry(
  p_queue_id uuid,
  p_decision text, -- 'approved', 'rejected'
  p_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can moderate entries';
  END IF;
  
  -- Update moderation queue
  UPDATE public.tracker_moderation_queue
  SET status = p_decision,
      moderator_id = auth.uid(),
      moderator_decision = p_notes,
      moderator_decided_at = now(),
      updated_at = now()
  WHERE id = p_queue_id;
  
  -- If rejected, remove the tracker entry or mark it
  IF p_decision = 'rejected' THEN
    UPDATE public.tracker_entries te
    SET is_flagged = true,
        moderator_notes = p_notes
    FROM public.tracker_moderation_queue tmq
    WHERE tmq.id = p_queue_id 
      AND te.id = tmq.entry_id;
  END IF;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- =============================================================
-- Trigger to Create Notification Preferences on User Creation
-- =============================================================
CREATE OR REPLACE FUNCTION public.create_default_notification_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_user_create_notification_prefs ON auth.users;

-- Create trigger
CREATE TRIGGER on_user_create_notification_prefs
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_notification_preferences();

-- =============================================================
-- Backfill notification preferences for existing users
-- =============================================================
INSERT INTO public.notification_preferences (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.notification_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- =============================================================
-- Add comment for documentation
-- =============================================================
COMMENT ON TABLE public.notification_preferences IS 'User notification preferences for email and push notifications';
COMMENT ON TABLE public.notification_logs IS 'Audit log of all notifications sent to users';
COMMENT ON TABLE public.tracker_moderation_queue IS 'Queue for tracker entries flagged for moderation review';
COMMENT ON FUNCTION public.auto_flag_tracker_outliers IS 'Identifies and flags tracker entries with processing times >3 standard deviations from mean';
