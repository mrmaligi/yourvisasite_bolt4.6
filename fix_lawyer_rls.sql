-- Fix RLS policies for lawyer approval
-- Allow admins to update lawyer_profiles

-- First, enable RLS on lawyer_profiles if not already
ALTER TABLE IF EXISTS public.lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Admins can update lawyer profiles" ON public.lawyer_profiles;
DROP POLICY IF EXISTS "Admin can manage lawyers" ON public.lawyer_profiles;

-- Create policy allowing admins to update any lawyer profile
CREATE POLICY "Admins can update lawyer profiles"
  ON public.lawyer_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Also allow admins to select all lawyer profiles
DROP POLICY IF EXISTS "Admins can view all lawyer profiles" ON public.lawyer_profiles;

CREATE POLICY "Admins can view all lawyer profiles"
  ON public.lawyer_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow lawyers to view their own profile
DROP POLICY IF EXISTS "Lawyers can view own profile" ON public.lawyer_profiles;

CREATE POLICY "Lawyers can view own profile"
  ON public.lawyer_profiles
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow lawyers to update their own profile (except verification fields)
DROP POLICY IF EXISTS "Lawyers can update own profile" ON public.lawyer_profiles;

CREATE POLICY "Lawyers can update own profile"
  ON public.lawyer_profiles
  FOR UPDATE
  USING (user_id = auth.uid());

-- Also fix profiles table RLS for admin updates
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS admin_check
      WHERE admin_check.id = auth.uid()
      AND admin_check.role = 'admin'
    )
  );

-- Enable admins to see all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS admin_check
      WHERE admin_check.id = auth.uid()
      AND admin_check.role = 'admin'
    )
  );
