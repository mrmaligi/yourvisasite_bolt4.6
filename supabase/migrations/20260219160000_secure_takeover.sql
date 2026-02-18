/*
  # Secure File Takeover

  1. Function
    - `check_takeover_status_transition`: Prevents unauthorized changes to `file_takeover_status`.
      - Only the user (client) or an admin can set status to 'accepted'.
      - Lawyers can only set status to 'requested' or 'rejected'.
  2. Trigger
    - `secure_takeover_status` on `public.bookings` (BEFORE UPDATE).
*/

CREATE OR REPLACE FUNCTION public.check_takeover_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is not changing, return new
  IF OLD.file_takeover_status IS NOT DISTINCT FROM NEW.file_takeover_status THEN
    RETURN NEW;
  END IF;

  -- Allow service role to bypass
  IF (current_setting('request.jwt.claim.role', true) = 'service_role') THEN
    RETURN NEW;
  END IF;

  -- Allow admins to do anything
  IF public.is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  -- Logic for 'accepted'
  IF NEW.file_takeover_status = 'accepted' THEN
    -- Only the user (owner) can accept.
    IF auth.uid() != NEW.user_id THEN
      RAISE EXCEPTION 'Only the client can accept a file takeover request.';
    END IF;
  END IF;

  -- Logic for 'requested'
  IF NEW.file_takeover_status = 'requested' THEN
    -- Only the lawyer (provider) or admin can request.
    -- Check if auth.uid() is the lawyer profile user.
    -- Lawyer ID in bookings is from lawyer.profiles.
    -- We need to check if auth.uid() matches lawyer.profiles.profile_id
    IF NOT EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE id = NEW.lawyer_id
        AND profile_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Only the lawyer can initiate a file takeover request.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS secure_takeover_status ON public.bookings;
CREATE TRIGGER secure_takeover_status
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.check_takeover_status_transition();
