/*
  # Lawyer File Takeover and Marketing Tools

  1. New Columns
    - `public.bookings`: Add `file_takeover_status` (text, nullable, check constraint)
    - `public.profiles`: Add `is_featured` (boolean, default false)

  2. Indexes
    - Index on `public.profiles(is_featured)`

  3. RLS Updates
    - Update `public.user_documents` policy to allow lawyers to view documents if they have an accepted takeover booking.
*/

-- Add file_takeover_status to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS file_takeover_status text CHECK (file_takeover_status IN ('requested', 'accepted', 'rejected'));

-- Add is_featured to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Create index for featured profiles
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON public.profiles(is_featured);

-- Update RLS for user_documents
-- We need to drop the existing policy and recreate it to include the new condition.
-- The existing policy is "Shared lawyers can view documents"

DROP POLICY IF EXISTS "Shared lawyers can view documents" ON public.user_documents;

CREATE POLICY "Shared lawyers can view documents"
  ON public.user_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.document_shares ds
      JOIN lawyer.profiles lp ON lp.id = ds.lawyer_id
      WHERE ds.document_id = user_documents.id
        AND lp.profile_id = auth.uid()
        AND ds.revoked_at IS NULL
    )
    OR
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN lawyer.profiles lp ON lp.id = b.lawyer_id
      WHERE b.user_id = user_documents.user_id
        AND lp.profile_id = auth.uid()
        AND b.file_takeover_status = 'accepted'
    )
  );
