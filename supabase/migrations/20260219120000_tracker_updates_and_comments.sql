/*
  # Tracker Updates and News Comments

  1. Tracker Updates
    - Update `tracker_entry_before_save` to set lawyer weight to 1.5 (1.5x base).
    - Set user/default weight to 1.0.
    - Note: This function replaces the logic from migration 035.

  2. News Comments
    - Drop restrictive policy on `news_comments`.
    - Allow all authenticated users to insert comments.
*/

-- 1. Update tracker_entry_before_save (the active trigger function)
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
    NEW.weight := 1.5;
  ELSIF NEW.submitter_role = 'user' THEN
    NEW.weight := 1.0;
  ELSE
    NEW.weight := 1.0;
  END IF;

  RETURN NEW;
END;
$$;

-- 2. News Comments Policy
DROP POLICY IF EXISTS "Lawyers and admins can insert comments" ON public.news_comments;

-- Re-create policy to allow any authenticated user to insert their own comments
CREATE POLICY "Authenticated users can insert comments"
  ON public.news_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = (select auth.uid())
  );
