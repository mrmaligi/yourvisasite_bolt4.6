/*
  # Lawyer Features and Updates

  1. Updates
    - Update `tracker_entry_before_insert` to give lawyer entries 2x weight (2.0 vs 1.0).

  2. Triggers
    - Add `share_docs_on_booking` trigger to automatically share documents when a booking is confirmed.
*/

-- 1. Update Tracker Weights
CREATE OR REPLACE FUNCTION public.tracker_entry_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Recalculate processing days just in case
  IF NEW.decision_date IS NOT NULL THEN
      NEW.processing_days := NEW.decision_date - NEW.application_date;
  END IF;

  -- Validation
  IF NEW.processing_days IS NOT NULL AND (NEW.processing_days < 1 OR NEW.processing_days > 1095) THEN
    -- Allow null for pending, but if present, validate
    RAISE EXCEPTION 'Processing days must be between 1 and 1095, got %', NEW.processing_days;
  END IF;

  -- Weight Logic Update
  IF NEW.submitter_role = 'lawyer' THEN
    NEW.weight := 2.0; -- 2x weight (relative to standard)
  ELSIF NEW.submitter_role = 'user' THEN
    NEW.weight := 1.0; -- Standard weight
  ELSE
    NEW.weight := 1.0; -- Standard weight for anonymous too
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Document Sharing Trigger
CREATE OR REPLACE FUNCTION public.share_docs_on_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- When a booking is confirmed (and wasn't before), share all user docs with the lawyer
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    INSERT INTO public.document_shares (document_id, lawyer_id)
    SELECT id, NEW.lawyer_id
    FROM public.user_documents
    WHERE user_id = NEW.user_id
    ON CONFLICT (document_id, lawyer_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_booking_confirmed_share_docs ON public.bookings;
CREATE TRIGGER on_booking_confirmed_share_docs
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.share_docs_on_booking();
