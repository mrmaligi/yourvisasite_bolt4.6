-- ============================================
-- CREATE ADMIN USER
-- Replace YOUR_EMAIL and YOUR_PASSWORD below
-- ============================================

-- Create auth user (for login)
-- Replace 'your-email@example.com' with your actual email
-- Replace 'your-secure-password' with your actual password
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'YOUR_EMAIL_HERE',                    -- ← CHANGE THIS
    crypt('YOUR_PASSWORD_HERE', gen_salt('bf')),  -- ← CHANGE THIS
    NOW(),
    '{"role": "admin", "full_name": "Admin User"}',
    NOW(),
    NOW()
)
RETURNING id;

-- Create profile for the admin (this will link to the auth user above)
-- Note: Get the UUID from the RETURNING above and replace USER_ID_HERE
INSERT INTO public.profiles (
    id,
    role,
    full_name,
    is_verified,
    created_at
) VALUES (
    'USER_ID_HERE',  -- ← Replace with the UUID returned from auth.users insert
    'admin',
    'Admin User',
    true,
    NOW()
);

SELECT 'Admin user created successfully' as status;
