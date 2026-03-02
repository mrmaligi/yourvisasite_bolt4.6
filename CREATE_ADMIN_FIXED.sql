-- ============================================
-- CREATE ADMIN USER: Manikaran (FIXED)
-- ============================================

-- First delete any existing user with this email
DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'manikaran2007@gmail.com');
DELETE FROM auth.users WHERE email = 'manikaran2007@gmail.com';

-- Create the user with ALL required columns
INSERT INTO auth.users (
    instance_id,
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
    action_link,
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
    email_change,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    is_anonymous,
    deleted_at,
    banned_until,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    confirmed_at,
    email_change_confirm_status
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
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
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin", "full_name": "Manikaran"}',
    NULL,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    '',
    '',
    '',
    NOW(),
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    '',
    NOW(),
    0
)
RETURNING id;

-- Note: After running, copy the returned ID and create the profile
