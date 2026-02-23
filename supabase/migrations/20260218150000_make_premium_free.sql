-- Migration to remove premium content payment requirement
-- Description: Makes all premium content freely accessible to all users (public)

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Allow access if purchased" ON public.visa_premium_content;

-- Create new policy allowing public read access
CREATE POLICY "Allow public read access" ON public.visa_premium_content
FOR SELECT USING (true);

-- Ensure RLS is still enabled (good practice, even if policy is permissive)
ALTER TABLE public.visa_premium_content ENABLE ROW LEVEL SECURITY;
