/*
  # Tracker Algorithm - Weighted Average + EWMA

  1. Custom Types
    - `tracker_state` - composite type for aggregate state (sum_weighted_times, sum_weights)

  2. Custom Aggregate
    - `weighted_avg(value, weight)` - role-weighted average of processing times

  3. Functions
    - `calculate_tracker_stats(visa_id)` - computes weighted avg, EWMA, percentiles
    - `tracker_entry_trigger()` - sets processing_days and weight on insert, refreshes stats

  4. Triggers
    - BEFORE INSERT on tracker_entries: computes processing_days and weight
    - AFTER INSERT on tracker_entries: recalculates stats for the visa

  5. Scheduled Job
    - pg_cron hourly refresh of all tracker stats as safety net

  6. View
    - `tracker_summary` - joins visas with tracker_stats for frontend queries

  7. Notes
    - Weights: Lawyer=10.0, User=2.0, Anonymous=1.0
    - EWMA alpha defaults to 0.3, configurable via platform_settings
    - Processing days validated: must be 1-1095 (3 years max)
*/

-- Custom composite type for aggregate state
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tracker_state') THEN
    CREATE TYPE public.tracker_state AS (
      sum_weighted_times numeric,
      sum_weights numeric
    );
  END IF;
END $$;

-- State transition function
CREATE OR REPLACE FUNCTION public.tracker_sfunc(
  state public.tracker_state,
  value numeric,
  weight numeric
)
RETURNS public.tracker_state
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN ROW(
    COALESCE(state.sum_weighted_times, 0) + (value * weight),
    COALESCE(state.sum_weights, 0) + weight
  )::public.tracker_state;
END;
$$;

-- Final function
CREATE OR REPLACE FUNCTION public.tracker_ffunc(state public.tracker_state)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF COALESCE(state.sum_weights, 0) = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND(state.sum_weighted_times / state.sum_weights, 1);
END;
$$;

-- Custom aggregate
DROP AGGREGATE IF EXISTS public.weighted_avg(numeric, numeric);
CREATE AGGREGATE public.weighted_avg(numeric, numeric) (
  SFUNC = public.tracker_sfunc,
  STYPE = public.tracker_state,
  FINALFUNC = public.tracker_ffunc,
  INITCOND = '(0, 0)'
);

-- Main stats calculation function
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

  SELECT
    public.weighted_avg(processing_days::numeric, weight),
    COUNT(*)::integer
  INTO v_weighted_avg, v_total
  FROM public.tracker_entries
  WHERE visa_id = target_visa_id;

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
  WHERE visa_id = target_visa_id;

  v_ewma := NULL;
  FOR rec IN
    SELECT processing_days
    FROM public.tracker_entries
    WHERE visa_id = target_visa_id
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

-- BEFORE INSERT trigger: set processing_days and weight
CREATE OR REPLACE FUNCTION public.tracker_entry_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.processing_days := NEW.decision_date - NEW.application_date;

  IF NEW.processing_days < 1 OR NEW.processing_days > 1095 THEN
    RAISE EXCEPTION 'Processing days must be between 1 and 1095, got %', NEW.processing_days;
  END IF;

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

DROP TRIGGER IF EXISTS tracker_entry_set_fields ON public.tracker_entries;
CREATE TRIGGER tracker_entry_set_fields
  BEFORE INSERT ON public.tracker_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.tracker_entry_before_insert();

-- AFTER INSERT trigger: recalculate stats
CREATE OR REPLACE FUNCTION public.tracker_entry_after_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.calculate_tracker_stats(NEW.visa_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tracker_entry_refresh_stats ON public.tracker_entries;
CREATE TRIGGER tracker_entry_refresh_stats
  AFTER INSERT ON public.tracker_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.tracker_entry_after_insert();

-- Scheduled hourly refresh
SELECT cron.schedule(
  'refresh-all-tracker-stats',
  '0 * * * *',
  $$
  DO $body$
  DECLARE
    v_id uuid;
  BEGIN
    FOR v_id IN SELECT DISTINCT visa_id FROM public.tracker_entries
    LOOP
      PERFORM public.calculate_tracker_stats(v_id);
    END LOOP;
  END $body$;
  $$
);

-- Convenience view for frontend
CREATE OR REPLACE VIEW public.tracker_summary AS
SELECT
  v.*,
  ts.weighted_avg_days,
  ts.ewma_days,
  ts.median_days,
  ts.p25_days,
  ts.p75_days,
  ts.total_entries,
  ts.last_updated AS stats_last_updated
FROM public.visas v
LEFT JOIN public.tracker_stats ts ON ts.visa_id = v.id
WHERE v.is_active = true;
