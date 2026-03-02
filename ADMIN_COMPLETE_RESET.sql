-- ============================================
-- COMPLETE RESET: Delete and Recreate Admin User
-- ============================================

-- 1. Delete existing user data completely
DELETE FROM public.profiles WHERE id = 'a1c1c904-6e7a-49ab-9a2d-02308632b1eb';
DELETE FROM auth.users WHERE email = 'manikaran2007@gmail.com';

-- 2. Create new user with proper password (using pgcrypt with bf algorithm)
-- The password hash format must be: $2a$10$...
WITH new_user AS (
    INSERT INTO auth.users (
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_sso_user,
        is_anonymous,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'manikaran2007@gmail.com',
        crypt('Qwerty@2007', '$2a$10$' || gen_random_bytes(22)::text),  -- Proper bcrypt format
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"role": "admin", "full_name": "Manikaran"}',
        false,
        false,
        NOW(),
        NOW()
    )
    RETURNING id
)
-- 3. Create profile immediately
INSERT INTO public.profiles (
    id, role, full_name, is_verified, verification_status, is_active, created_at, updated_at
)
SELECT id, 'admin', 'Manikaran', true, 'approved', true, NOW(), NOW()
FROM new_user;

-- 4. Verify
SELECT 
    u.id, 
    u.email, 
    u.encrypted_password IS NOT NULL as has_password,
    p.role as profile_role,
    p.is_verified
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'manikaran2007@gmail.com';
