-- ============================================
-- CREATE ADMIN USER: Manikaran
-- Email: manikaran2007@gmail.com
-- Password: Qwerty@2007
-- ============================================

DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    -- 1. Create auth user (for login)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'manikaran2007@gmail.com',
        crypt('Qwerty@2007', gen_salt('bf')),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"role": "admin", "full_name": "Manikaran"}',
        NOW(),
        NOW()
    );

    -- 2. Create admin profile
    INSERT INTO public.profiles (
        id,
        role,
        full_name,
        is_verified,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        'admin',
        'Manikaran',
        true,
        true,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Admin user created with ID: %', new_user_id;
END $$;

SELECT 'Admin user created successfully!' as status;
