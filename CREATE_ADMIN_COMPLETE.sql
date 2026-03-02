-- ============================================
-- FIX: Create admin user with ALL required auth columns
-- ============================================

DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    -- 1. Create auth user with ALL required columns
    INSERT INTO auth.users (
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        new_email,
        invited_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change_token_current,
        email_change_token_new,
        reauthentication_token,
        is_sso_user,
        deleted_at
    ) VALUES (
        new_user_id,
        'authenticated',
        'authenticated',
        'manikaran2007@gmail.com',
        crypt('Qwerty@2007', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        '{"role": "admin", "full_name": "Manikaran"}'::jsonb,
        false,
        NOW(),
        NOW(),
        NULL,
        NULL,
        '',
        '',
        '',
        '',
        '',
        false,
        NULL
    );

    -- 2. Create admin profile
    INSERT INTO public.profiles (
        id,
        role,
        full_name,
        avatar_url,
        phone,
        bar_number,
        jurisdiction,
        practice_areas,
        years_experience,
        hourly_rate_cents,
        is_verified,
        verification_status,
        created_at,
        updated_at,
        is_active
    ) VALUES (
        new_user_id,
        'admin',
        'Manikaran',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        'approved',
        NOW(),
        NOW(),
        true
    );

    RAISE NOTICE 'Admin user created with ID: %', new_user_id;
END $$;

SELECT 'Admin user created successfully!' as status;
