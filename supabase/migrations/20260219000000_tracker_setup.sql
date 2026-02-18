-- Allow pending entries
ALTER TYPE public.tracker_outcome ADD VALUE IF NOT EXISTS 'pending';

-- Make date/days nullable
ALTER TABLE public.tracker_entries ALTER COLUMN decision_date DROP NOT NULL;
ALTER TABLE public.tracker_entries ALTER COLUMN processing_days DROP NOT NULL;

-- Update trigger function
CREATE OR REPLACE FUNCTION public.tracker_entry_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.decision_date IS NULL THEN
    NEW.processing_days := NULL;
  ELSE
    NEW.processing_days := NEW.decision_date - NEW.application_date;

    IF NEW.processing_days < 1 OR NEW.processing_days > 1095 THEN
      RAISE EXCEPTION 'Processing days must be between 1 and 1095, got %', NEW.processing_days;
    END IF;
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

-- Update stats calculation to ignore NULL processing_days
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
  WHERE visa_id = target_visa_id AND processing_days IS NOT NULL;

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
  WHERE visa_id = target_visa_id AND processing_days IS NOT NULL;

  v_ewma := NULL;
  FOR rec IN
    SELECT processing_days
    FROM public.tracker_entries
    WHERE visa_id = target_visa_id AND processing_days IS NOT NULL
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

-- Seed Visas
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary) VALUES
('189', 'Skilled Independent', 'Australia', 'work', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189', 'For invited workers with skills Australia needs, to live and work permanently anywhere in Australia.'),
('190', 'Skilled Nominated', 'Australia', 'work', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190', 'For nominated skilled workers to live and work in Australia as permanent residents.'),
('491', 'Skilled Work Regional', 'Australia', 'work', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-provisional-491', 'For skilled people nominated by a state or territory government to live and work in regional Australia.'),
('482', 'Temporary Skill Shortage', 'Australia', 'work', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482', 'Enables employers to address labour shortages by bringing in skilled workers where they cannot source an appropriately skilled Australian worker.'),
('186', 'Employer Nomination Scheme', 'Australia', 'work', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186', 'For skilled workers nominated by an employer to live and work in Australia permanently.'),
('500', 'Student Visa', 'Australia', 'student', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', 'Allows you to stay in Australia to study full-time at a recognised educational institution.'),
('600', 'Visitor Visa', 'Australia', 'visitor', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600', 'For people who want to visit Australia as a tourist, for business visitor activities or to visit family.'),
('820/801', 'Partner Visa (Onshore)', 'Australia', 'family', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore', 'Allows the partner or spouse of an Australian citizen, Australian permanent resident or eligible New Zealand citizen to live in Australia.'),
('309/100', 'Partner Visa (Offshore)', 'Australia', 'family', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-offshore', 'Allows the partner or spouse of an Australian citizen, Australian permanent resident or eligible New Zealand citizen to live in Australia.'),
('101', 'Child Visa', 'Australia', 'family', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/child-101', 'For children to stay in Australia permanently with their parents.'),
('143', 'Contributory Parent Visa', 'Australia', 'family', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-143', 'For parents of a settled Australian citizen, Australian permanent resident or eligible New Zealand citizen to move to Australia permanently.')
ON CONFLICT (subclass_number) DO NOTHING;
