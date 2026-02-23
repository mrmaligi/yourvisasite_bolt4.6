-- Migration: Create lawyer_profiles table in public schema
-- This matches what the LawyerDashboard and other components expect

-- Create lawyer_profiles table (public schema)
CREATE TABLE IF NOT EXISTS public.lawyer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  bar_number text NOT NULL DEFAULT '',
  jurisdiction text NOT NULL DEFAULT '',
  practice_areas text[] NOT NULL DEFAULT '{}',
  years_experience integer NOT NULL DEFAULT 0,
  bio text,
  hourly_rate_cents integer,
  is_verified boolean NOT NULL DEFAULT false,
  verification_status text NOT NULL DEFAULT 'pending',
  verification_document_url text,
  rejection_reason text,
  verified_at timestamptz,
  verified_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public view verified lawyer profiles"
  ON public.lawyer_profiles FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Lawyers view own profile"
  ON public.lawyer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Lawyers update own profile"
  ON public.lawyer_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage lawyer profiles"
  ON public.lawyer_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION extensions.moddatetime()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lawyer_profiles_updated_at ON public.lawyer_profiles;
CREATE TRIGGER lawyer_profiles_updated_at
  BEFORE UPDATE ON public.lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime();

-- Create lawyer profile for existing lawyer users
INSERT INTO public.lawyer_profiles (user_id, bar_number, jurisdiction, years_experience, is_verified, verification_status)
SELECT 
  p.id,
  COALESCE(p.bar_number, 'AU-' || substr(p.id::text, 1, 8)),
  COALESCE(p.jurisdiction, 'NSW'),
  COALESCE(p.years_experience, 5),
  true,
  'approved'
FROM public.profiles p
WHERE p.role = 'lawyer'
AND NOT EXISTS (SELECT 1 FROM public.lawyer_profiles lp WHERE lp.user_id = p.id);

-- Verify
SELECT 'lawyer_profiles created' as status, COUNT(*) as count FROM public.lawyer_profiles;
