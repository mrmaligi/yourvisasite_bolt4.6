-- ============================================
-- DEBUG AUTH SCHEMA ISSUES
-- ============================================

-- 1. Check extensions
SELECT extname, extversion FROM pg_extension WHERE extname IN ('pgcrypto', 'uuid-ossp');

-- 2. Check RLS on auth.users
SELECT relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname = 'users' AND relnamespace = 'auth'::regnamespace;

-- 3. Check if we can insert a test user directly
-- Try minimal insert
DO $$
BEGIN
    INSERT INTO auth.users (id, email, encrypted_password, is_sso_user, is_anonymous)
    VALUES (gen_random_uuid(), 'test@example.com', crypt('test', gen_salt('bf')), false, false);
    
    RAISE NOTICE 'Test insert successful';
    
    -- Clean up test user
    DELETE FROM auth.users WHERE email = 'test@example.com';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error: %', SQLERRM;
END $$;

-- 4. Check current user count
SELECT COUNT(*) as user_count FROM auth.users;

-- 5. Check for any constraints that might block
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'auth.users'::regclass AND contype = 'c';
