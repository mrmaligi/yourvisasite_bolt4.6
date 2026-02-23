-- Migration: Ensure all auth users have profiles
-- Fixes missing profile records that cause "Cannot read properties of null (reading 'role')" errors

-- 1. First, let's create any missing profiles for existing auth users
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

-- 2. Update specific test users with correct roles
UPDATE public.profiles 
SET role = 'admin', is_active = true
WHERE email = 'admin@visabuild.local' OR email LIKE '%admin@%';

UPDATE public.profiles 
SET role = 'lawyer', is_active = true
WHERE email = 'lawyer@visabuild.local' OR email LIKE '%lawyer@%';

UPDATE public.profiles 
SET role = 'user', is_active = true
WHERE email = 'applicant@visabuild.local' OR email LIKE '%applicant@%';

-- 3. Ensure the handle_new_user trigger exists and is correct
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
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'user'),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 4. Ensure trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Create lawyer profiles for any lawyer users that don't have them
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

-- 6. Verify results
SELECT 
  'Profiles created/fixed' as check_item,
  COUNT(*) as count
FROM public.profiles
UNION ALL
SELECT 
  'Auth users without profiles (should be 0)' as check_item,
  COUNT(*)
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
UNION ALL
SELECT 
  'Lawyer profiles created' as check_item,
  COUNT(*)
FROM public.lawyer_profiles;
