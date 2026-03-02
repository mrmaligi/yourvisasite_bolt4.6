-- Create helper function to get lawyer ID for current user
CREATE OR REPLACE FUNCTION public.get_my_lawyer_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM lawyer.profiles WHERE profile_id = auth.uid();
$$;

-- Drop existing complex policies for lawyers on bookings
DROP POLICY IF EXISTS "Lawyers can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Lawyers can update assigned bookings" ON public.bookings;

-- Re-create policies using the helper function for better performance and clarity
-- This avoids the correlated subquery in the RLS policy which can be problematic for Realtime
CREATE POLICY "Lawyers can view assigned bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    lawyer_id = public.get_my_lawyer_id()
  );

CREATE POLICY "Lawyers can update assigned bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    lawyer_id = public.get_my_lawyer_id()
  )
  WITH CHECK (
    lawyer_id = public.get_my_lawyer_id()
  );
