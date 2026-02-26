-- Fix for "Setting Up Your Account" stuck loading issue
-- 1. Restore robust handle_new_user trigger with ON CONFLICT support
-- 2. Backfill missing profiles for existing users
-- 3. Ensure lawyer profiles exist
-- 4. Fix permissions

-- Re-create the trigger function with ON CONFLICT and proper type casting
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'user'::public.user_role),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Ensure trigger is properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill missing profiles
INSERT INTO public.profiles (id, role, full_name, is_active, created_at, updated_at)
SELECT
  au.id,
  COALESCE(
    (au.raw_user_meta_data->>'role')::public.user_role,
    CASE
      WHEN au.email LIKE '%admin%' THEN 'admin'::public.user_role
      WHEN au.email LIKE '%lawyer%' THEN 'lawyer'::public.user_role
      ELSE 'user'::public.user_role
    END
  ),
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ),
  true,
  COALESCE(au.created_at, NOW()),
  COALESCE(au.updated_at, NOW())
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Ensure all profiles are active (in case they were created with default is_active=false or null)
UPDATE public.profiles SET is_active = true WHERE is_active IS NOT true;

-- Ensure lawyer profiles exist for lawyer users
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

-- Verify RLS policies (simple check to ensure public read access exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'profiles'
        AND policyname = 'Profiles are viewable by everyone'
    ) THEN
        CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
    END IF;
END
$$;
