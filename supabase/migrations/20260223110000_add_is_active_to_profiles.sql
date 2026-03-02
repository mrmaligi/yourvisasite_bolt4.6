-- Add is_active column to profiles table for account status tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing profiles to have is_active = true
UPDATE public.profiles SET is_active = true WHERE is_active IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.is_active IS 'Whether the user account is active (false = disabled)';
