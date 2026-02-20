-- FIX MOCK USERS - Create auth.users with passwords
-- This allows logging in with these test accounts

-- First, let's create proper auth.users for the mock profiles
-- Password for all: "Test123456!"

-- Note: We need to use the Supabase Auth API or admin functions
-- Direct SQL insertion into auth.users is restricted

-- Alternative: Create a SQL function to generate users
CREATE OR REPLACE FUNCTION create_mock_auth_user(
    user_email TEXT,
    user_password TEXT,
    user_id UUID
) RETURNS VOID AS $$
BEGIN
    -- This will be handled by Supabase Auth
    -- We need to use the dashboard or API instead
    RAISE NOTICE 'User % should be created via Supabase Auth API', user_email;
END;
$$ LANGUAGE plpgsql;

-- Better approach: Update profiles to match existing auth users
-- OR create new auth users via the dashboard

-- For now, let's create a workaround:
-- We'll create invite links or set up the users properly

-- Check which profiles DON'T have auth.users
SELECT 
    p.id,
    p.full_name,
    p.role,
    au.id as auth_user_exists
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.id IS NULL;

-- The issue: 17 mock profiles exist but have NO auth.users entry
-- This means they were created directly in profiles table
-- without going through Supabase Auth signup flow

-- SOLUTION OPTIONS:

-- Option 1: Create the auth users via Supabase Dashboard
-- Go to: https://supabase.com/dashboard/project/usiorucxradthxhetqaq/auth/users
-- Click "Add User" for each mock user

-- Option 2: Use Supabase Auth API (requires API call)
-- POST /auth/v1/admin/users

-- Option 3: Quick workaround - create ONE admin test account
-- You can use to impersonate/mock login

-- For immediate testing, create a simple test account:
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'test@visabuild.com',
    crypt('Test123456!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test User"}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create profile for test user
INSERT INTO profiles (
    id,
    role,
    full_name,
    is_active
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'admin',
    'Test Admin',
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- Test credentials:
-- Email: test@visabuild.com
-- Password: Test123456!
