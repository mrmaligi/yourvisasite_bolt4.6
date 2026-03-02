-- Add is_active column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing profiles to have is_active = true
UPDATE public.profiles SET is_active = true WHERE is_active IS NULL;

-- Verify
SELECT id, role, full_name, is_active FROM public.profiles;
