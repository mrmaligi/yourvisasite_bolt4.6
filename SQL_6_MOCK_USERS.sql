-- SQL_6: MOCK USERS (30 total: 10 users, 10 lawyers, 10 admins)
-- Run this last

DELETE FROM auth.users WHERE email LIKE '%@visabuild.test';

-- 10 regular users
DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Sarah Chen','James Wilson','Priya Patel','Mohammed Al-Hassan','Emma Thompson','Carlos Rodriguez','Yuki Tanaka','Fatima Ahmed','Liam OBrien','Sofia Rossi'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    user_id := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (user_id, 'user' || i || '@visabuild.test', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider":"email"}', jsonb_build_object('full_name', names[i]), 'authenticated', 'authenticated');
  END LOOP;
END $$;

-- 10 lawyers
DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Dr Amanda Hayes','Barrister Raj Kapoor','Sarah Mitchell LLB','David Park','Maria Santos','Thomas Wright','Aisha Khan','Robert Chen','Jennifer Adams','Michael Brown'];
  jurisdictions text[] := ARRAY['NSW','VIC','QLD','WA','SA','NSW','VIC','QLD','WA','SA'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    user_id := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (user_id, 'lawyer' || i || '@visabuild.test', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider":"email"}', jsonb_build_object('full_name', names[i]), 'authenticated', 'authenticated');
    UPDATE public.profiles SET role = 'lawyer', bar_number = 'AU-' || (10000 + floor(random() * 90000)), jurisdiction = jurisdictions[i], years_experience = 5 + floor(random() * 20), hourly_rate_cents = (150 + floor(random() * 300)) * 100, is_verified = true, verification_status = 'approved' WHERE id = user_id;
  END LOOP;
END $$;

-- 10 admins
DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Alex Admin','System Moderator','Content Manager','Support Lead','Security Admin','Data Admin','User Admin','Finance Admin','Tech Admin','Super Admin'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    user_id := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (user_id, 'admin' || i || '@visabuild.test', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider":"email"}', jsonb_build_object('full_name', names[i]), 'authenticated', 'authenticated');
    UPDATE public.profiles SET role = 'admin' WHERE id = user_id;
  END LOOP;
END $$;

-- Verify everything
SELECT '=== SETUP COMPLETE ===' as status
UNION ALL SELECT 'Visas: ' || COUNT(*)::text FROM public.visas
UNION ALL SELECT 'Profiles: ' || COUNT(*)::text FROM public.profiles
UNION ALL SELECT 'Mock users: ' || COUNT(*)::text FROM auth.users WHERE email LIKE '%@visabuild.test';
