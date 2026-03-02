-- ============================================
-- FIND AND FIX EXISTING USER
-- ============================================

-- 1. Find the existing user
SELECT 
    id, 
    email, 
    is_sso_user, 
    confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'manikaran2007@gmail.com';

-- 2. Check if profile exists
SELECT 
    p.id,
    p.role,
    p.full_name,
    p.is_verified,
    p.verification_status
FROM public.profiles p
WHERE p.id IN (SELECT id FROM auth.users WHERE email = 'manikaran2007@gmail.com');

-- 3. Fix the password for existing user
UPDATE auth.users 
SET encrypted_password = crypt('Qwerty@2007', gen_salt('bf')),
    raw_user_meta_data = '{"role": "admin", "full_name": "Manikaran"}'::jsonb
WHERE email = 'manikaran2007@gmail.com';

-- 4. Create or update profile
INSERT INTO public.profiles (
    id, role, full_name, is_verified, verification_status, is_active, created_at, updated_at
)
SELECT 
    id, 
    'admin', 
    'Manikaran', 
    true, 
    'approved', 
    true,
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'manikaran2007@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET 
    role = 'admin',
    full_name = 'Manikaran',
    is_verified = true,
    verification_status = 'approved',
    is_active = true,
    updated_at = NOW();

-- 5. Verify
SELECT 
    u.email,
    u.encrypted_password IS NOT NULL as has_password,
    p.role,
    p.is_verified
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'manikaran2007@gmail.com';
