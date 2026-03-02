-- FIX: Create test user with proper bypass
-- Run this in Supabase SQL Editor as postgres/admin

-- Disable RLS temporarily for fix
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Create auth user with all required fields
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    confirmation_sent_at,
    email_change,
    email_change_sent_at,
    new_email,
    invited_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current,
    reauthentication_token,
    is_sso_user,
    deleted_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'authenticated',
    'authenticated',
    'test@visabuild.com',
    crypt('TestPass123!', gen_salt('bf')),
    NOW(),
    NULL,
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Admin"}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '',
    '',
    '',
    '',
    '',
    FALSE,
    NULL
) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('TestPass123!', gen_salt('bf')),
    email_confirmed_at = NOW(),
    updated_at = NOW();

-- Create matching profile
INSERT INTO profiles (
    id,
    role,
    full_name,
    is_active,
    created_at,
    updated_at
) VALUES (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'admin',
    'Test Admin',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Test Admin',
    is_active = TRUE;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT 
    p.id, 
    p.full_name, 
    p.role, 
    au.email,
    au.email_confirmed_at IS NOT NULL as email_confirmed
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'test@visabuild.com';
