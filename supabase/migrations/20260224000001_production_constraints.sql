-- Migration: Production database integrity fixes
-- Part 2: Add constraints and indexes for data integrity

-- 1. Ensure profiles.id is properly referencing auth.users
-- Add FK constraint if not exists (this ensures referential integrity)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Ensure lawyer_profiles.user_id references profiles.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'lawyer_profiles_user_id_fkey' 
    AND table_name = 'lawyer_profiles'
  ) THEN
    ALTER TABLE public.lawyer_profiles
    ADD CONSTRAINT lawyer_profiles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Create index on profiles.role for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 4. Create index on profiles.is_active for active user queries  
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active) WHERE is_active = true;

-- 5. Add NOT NULL constraint to profiles.role if not already
DO $$
BEGIN
  ALTER TABLE public.profiles
  ALTER COLUMN role SET NOT NULL;
EXCEPTION
  WHEN others THEN
    -- Column may already have NOT NULL or have null values
    -- Update any null roles first
    UPDATE public.profiles SET role = 'user' WHERE role IS NULL;
    ALTER TABLE public.profiles
    ALTER COLUMN role SET NOT NULL;
END $$;

-- 6. Add default value for is_active
ALTER TABLE public.profiles 
ALTER COLUMN is_active SET DEFAULT true;

-- 7. Update any existing null is_active values
UPDATE public.profiles SET is_active = true WHERE is_active IS NULL;

-- 8. Add NOT NULL constraint to is_active
ALTER TABLE public.profiles
ALTER COLUMN is_active SET NOT NULL;

-- 9. Ensure RLS is enabled on all critical tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- 10. Create comprehensive RLS policies for profiles

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view verified lawyer profiles" ON public.profiles;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile  
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can do everything
CREATE POLICY "Admins have full access"
  ON public.profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Public can view verified lawyer profiles
CREATE POLICY "Public can view verified lawyers"
  ON public.profiles FOR SELECT
  USING (role = 'lawyer' AND is_verified = true);

-- 11. Create RLS policies for lawyer_profiles
DROP POLICY IF EXISTS "Lawyers can view own profile" ON public.lawyer_profiles;
DROP POLICY IF EXISTS "Lawyers can update own profile" ON public.lawyer_profiles;
DROP POLICY IF EXISTS "Public can view verified lawyer details" ON public.lawyer_profiles;

CREATE POLICY "Lawyers can view own lawyer profile"
  ON public.lawyer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Lawyers can update own lawyer profile"
  ON public.lawyer_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view verified lawyer details"
  ON public.lawyer_profiles FOR SELECT
  USING (is_verified = true AND verification_status = 'approved');

CREATE POLICY "Admins can manage lawyer profiles"
  ON public.lawyer_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 12. Grant appropriate permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.lawyer_profiles TO anon, authenticated;

-- 13. Final verification
SELECT 
  'Total profiles' as metric,
  COUNT(*)::text as value
FROM public.profiles
UNION ALL
SELECT 
  'Total auth users',
  COUNT(*)::text
FROM auth.users
UNION ALL
SELECT 
  'Orphaned auth users (no profile)',
  COUNT(*)::text
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
UNION ALL
SELECT 
  'Admins',
  COUNT(*)::text
FROM public.profiles WHERE role = 'admin'
UNION ALL
SELECT 
  'Lawyers',
  COUNT(*)::text
FROM public.profiles WHERE role = 'lawyer'
UNION ALL
SELECT 
  'Regular users',
  COUNT(*)::text
FROM public.profiles WHERE role = 'user';
