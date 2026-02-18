-- Allow pending applications
ALTER TYPE public.tracker_outcome ADD VALUE IF NOT EXISTS 'pending';

-- Add status column
ALTER TABLE public.tracker_entries
  ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('pending', 'completed')) DEFAULT 'completed';

-- Make date/days nullable
ALTER TABLE public.tracker_entries
  ALTER COLUMN decision_date DROP NOT NULL;

ALTER TABLE public.tracker_entries
  ALTER COLUMN processing_days DROP NOT NULL;

ALTER TABLE public.tracker_entries
  ALTER COLUMN processing_days DROP DEFAULT;

-- Update existing entries
UPDATE public.tracker_entries SET status = 'completed' WHERE status IS NULL;

-- Create new trigger function
CREATE OR REPLACE FUNCTION public.tracker_entry_before_save()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- If pending, ensure decision_date and processing_days are NULL
  IF NEW.outcome = 'pending' THEN
    NEW.status := 'pending';
    NEW.decision_date := NULL;
    NEW.processing_days := NULL;
  ELSE
    NEW.status := 'completed';
    -- Calculate processing days if completed
    IF NEW.decision_date IS NULL THEN
        RAISE EXCEPTION 'Decision date is required for completed applications';
    END IF;
    NEW.processing_days := NEW.decision_date - NEW.application_date;

    IF NEW.processing_days < 0 THEN
       RAISE EXCEPTION 'Processing days cannot be negative';
    END IF;

    IF NEW.processing_days > 1095 THEN
         RAISE EXCEPTION 'Processing days must be between 1 and 1095, got %', NEW.processing_days;
    END IF;
  END IF;

  -- Set weight based on role
  IF NEW.submitter_role = 'lawyer' THEN
    NEW.weight := 10.0;
  ELSIF NEW.submitter_role = 'user' THEN
    NEW.weight := 2.0;
  ELSE
    NEW.weight := 1.0;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop old trigger
DROP TRIGGER IF EXISTS tracker_entry_set_fields ON public.tracker_entries;

-- Create new trigger for INSERT OR UPDATE
CREATE TRIGGER tracker_entry_set_fields
  BEFORE INSERT OR UPDATE ON public.tracker_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.tracker_entry_before_save();

-- Update stats calculation to ignore pending (where processing_days is NULL)
CREATE OR REPLACE FUNCTION public.calculate_tracker_stats(target_visa_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_weighted_avg numeric;
  v_ewma numeric;
  v_median numeric;
  v_p25 numeric;
  v_p75 numeric;
  v_total integer;
  v_alpha numeric;
  rec record;
BEGIN
  SELECT COALESCE((value ->> 'value')::numeric, 0.3)
  INTO v_alpha
  FROM public.platform_settings
  WHERE key = 'tracker_alpha';

  IF v_alpha IS NULL THEN
    v_alpha := 0.3;
  END IF;

  -- Filter for completed entries only (where processing_days IS NOT NULL)
  SELECT
    public.weighted_avg(processing_days::numeric, weight),
    COUNT(*)::integer
  INTO v_weighted_avg, v_total
  FROM public.tracker_entries
  WHERE visa_id = target_visa_id
    AND processing_days IS NOT NULL;

  IF v_total = 0 THEN
    DELETE FROM public.tracker_stats WHERE visa_id = target_visa_id;
    RETURN;
  END IF;

  SELECT
    percentile_cont(0.5) WITHIN GROUP (ORDER BY processing_days),
    percentile_cont(0.25) WITHIN GROUP (ORDER BY processing_days),
    percentile_cont(0.75) WITHIN GROUP (ORDER BY processing_days)
  INTO v_median, v_p25, v_p75
  FROM public.tracker_entries
  WHERE visa_id = target_visa_id
    AND processing_days IS NOT NULL;

  v_ewma := NULL;
  FOR rec IN
    SELECT processing_days
    FROM public.tracker_entries
    WHERE visa_id = target_visa_id
      AND processing_days IS NOT NULL
    ORDER BY created_at ASC
  LOOP
    IF v_ewma IS NULL THEN
      v_ewma := rec.processing_days;
    ELSE
      v_ewma := v_alpha * rec.processing_days + (1 - v_alpha) * v_ewma;
    END IF;
  END LOOP;

  v_ewma := ROUND(v_ewma, 1);

  INSERT INTO public.tracker_stats (visa_id, weighted_avg_days, ewma_days, median_days, p25_days, p75_days, total_entries, last_updated)
  VALUES (target_visa_id, v_weighted_avg, v_ewma, v_median, v_p25, v_p75, v_total, now())
  ON CONFLICT (visa_id) DO UPDATE SET
    weighted_avg_days = EXCLUDED.weighted_avg_days,
    ewma_days = EXCLUDED.ewma_days,
    median_days = EXCLUDED.median_days,
    p25_days = EXCLUDED.p25_days,
    p75_days = EXCLUDED.p75_days,
    total_entries = EXCLUDED.total_entries,
    last_updated = EXCLUDED.last_updated;
END;
$$;


-- Update trigger for refreshing stats to include UPDATE
DROP TRIGGER IF EXISTS tracker_entry_refresh_stats ON public.tracker_entries;
CREATE TRIGGER tracker_entry_refresh_stats
  AFTER INSERT OR UPDATE ON public.tracker_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.tracker_entry_after_insert();
