-- EMERGENCY FIX: Create working test account
-- This handles the case where auth.user exists but profile is missing/wrong

-- Step 1: Find the auth user that was created
SELECT id, email, created_at FROM auth.users WHERE email = 'test@visabuild.com';

-- Step 2: If found, delete conflicting profile and recreate
DELETE FROM profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'test@visabuild.com');

-- Step 3: Disable RLS, create profile, re-enable
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

INSERT INTO profiles (id, role, full_name, is_active, created_at, updated_at)
SELECT 
    id,
    'admin',
    'Test Admin',
    TRUE,
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'test@visabuild.com'
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Test Admin',
    is_active = TRUE;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT p.id, p.full_name, p.role, p.is_active, au.email
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'test@visabuild.com';
