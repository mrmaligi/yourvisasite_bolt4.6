-- ============================================================================
-- FIX LOGIN AND CREATE USERS
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- ============================================================================

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Ensure lawyer_profiles table exists (if missing)
CREATE TABLE IF NOT EXISTS public.lawyer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    bar_number TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    specializations TEXT[],
    years_experience INTEGER,
    bio TEXT,
    credentials_url TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    hourly_rate_cents INTEGER,
    consultation_fee_cents INTEGER,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on lawyer_profiles
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for lawyer_profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'lawyer_profiles' AND policyname = 'Lawyer profiles are viewable'
    ) THEN
        CREATE POLICY "Lawyer profiles are viewable" ON public.lawyer_profiles FOR SELECT USING (verification_status = 'approved');
    END IF;
END $$;


-- 2. Cleanup existing users to avoid conflicts
DELETE FROM auth.users WHERE email IN ('admin@visabuild.local', 'test@visabuild.com', 'lawyer@visabuild.com');

-- 3. Create Users
DO $$
DECLARE
    admin_id UUID := gen_random_uuid();
    test_user_id UUID := gen_random_uuid();
    lawyer_id UUID := gen_random_uuid();
BEGIN
    -- Create Admin User (admin@visabuild.local / admin123)
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
        admin_id,
        'admin@visabuild.local',
        crypt('admin123', gen_salt('bf')),
        NOW(),
        '{"provider":"email"}',
        '{"full_name":"Admin User"}',
        'authenticated',
        'authenticated'
    );

    -- Create/Update Admin Profile
    INSERT INTO public.profiles (id, role, full_name, is_active)
    VALUES (admin_id, 'admin', 'Admin User', true)
    ON CONFLICT (id) DO UPDATE SET role = 'admin', is_active = true;


    -- Create Test User (test@visabuild.com / Test123456!)
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
        test_user_id,
        'test@visabuild.com',
        crypt('Test123456!', gen_salt('bf')),
        NOW(),
        '{"provider":"email"}',
        '{"full_name":"Test User"}',
        'authenticated',
        'authenticated'
    );

    -- Create/Update Test User Profile
    INSERT INTO public.profiles (id, role, full_name, is_active)
    VALUES (test_user_id, 'user', 'Test User', true)
    ON CONFLICT (id) DO UPDATE SET role = 'user', is_active = true;


    -- Create Lawyer User (lawyer@visabuild.com / Lawyer123!)
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
        lawyer_id,
        'lawyer@visabuild.com',
        crypt('Lawyer123!', gen_salt('bf')),
        NOW(),
        '{"provider":"email"}',
        '{"full_name":"Lawyer User"}',
        'authenticated',
        'authenticated'
    );

    -- Create/Update Lawyer Profile
    INSERT INTO public.profiles (id, role, full_name, is_active)
    VALUES (lawyer_id, 'lawyer', 'Lawyer User', true)
    ON CONFLICT (id) DO UPDATE SET role = 'lawyer', is_active = true;

    -- Create Lawyer Profile Entry
    INSERT INTO public.lawyer_profiles (
        user_id, bar_number, jurisdiction, verification_status, is_available
    ) VALUES (
        lawyer_id, 'L123456', 'NSW', 'approved', true
    );

END $$;

-- 4. Verification
SELECT email, id, role FROM auth.users WHERE email IN ('admin@visabuild.local', 'test@visabuild.com', 'lawyer@visabuild.com');
