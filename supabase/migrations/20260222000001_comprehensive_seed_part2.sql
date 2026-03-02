-- ============================================================================
-- PART 2: TEST USERS WITH FULL PROFILES
-- ============================================================================

-- Delete existing test users
DELETE FROM auth.users WHERE email LIKE '%@visabuild.local';

-- Create extensions if not exist
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TEST USER 1: ADMIN
-- =====================================================
DO $$
DECLARE
    admin_id UUID := 'a0000000-0000-0000-0000-000000000001'::UUID;
BEGIN
    -- Create auth user
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, 
        created_at, updated_at
    ) VALUES (
        admin_id,
        'admin@visabuild.local',
        crypt('admin123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"System Administrator","first_name":"System","last_name":"Admin"}'::jsonb,
        'authenticated',
        'authenticated',
        NOW(),
        NOW()
    );
    
    -- Update profile to admin role
    UPDATE public.profiles 
    SET 
        role = 'admin',
        full_name = 'System Administrator',
        phone = '+61 400 000 001',
        is_verified = true,
        email_notifications = true,
        push_notifications = true,
        updated_at = NOW()
    WHERE id = admin_id;
END $$;

-- =====================================================
-- TEST USER 2: LAWYER WITH FULL PROFILE
-- =====================================================
DO $$
DECLARE
    lawyer_id UUID := 'a0000000-0000-0000-0000-000000000002'::UUID;
BEGIN
    -- Create auth user
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, 
        created_at, updated_at
    ) VALUES (
        lawyer_id,
        'lawyer@visabuild.local',
        crypt('lawyer123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Sarah Mitchell","first_name":"Sarah","last_name":"Mitchell"}'::jsonb,
        'authenticated',
        'authenticated',
        NOW(),
        NOW()
    );
    
    -- Update profile with lawyer details
    UPDATE public.profiles 
    SET 
        role = 'lawyer',
        full_name = 'Sarah Mitchell',
        phone = '+61 412 345 678',
        is_verified = true,
        bar_number = 'NSW-123456',
        jurisdiction = 'NSW',
        practice_areas = ARRAY['Skilled Migration', 'Partner Visas', 'Employer Sponsorship', 'Student Visas'],
        years_experience = 12,
        hourly_rate_cents = 35000, -- $350/hour
        email_notifications = true,
        push_notifications = true,
        updated_at = NOW()
    WHERE id = lawyer_id;
END $$;

-- Create full lawyer_profile record
INSERT INTO public.lawyer_profiles (
    id, user_id, bio, education, languages, 
    specializations, success_rate, total_cases, 
    average_rating, review_count, availability_schedule,
    is_available, consultation_types
) VALUES (
    gen_random_uuid(),
    'a0000000-0000-0000-0000-000000000002'::UUID,
    E'Senior migration lawyer with 12+ years experience in Australian immigration law. Specialised in skilled migration, partner visas, and employer sponsorship. Former Department of Home Affairs officer with insider knowledge of visa processing.\n\nFluent in English and Mandarin. Helping clients navigate complex visa pathways with a 98% success rate.',
    ARRAY[
        'LLB (Hons) - University of Sydney',
        'Graduate Diploma in Migration Law - ANU',
        'Admitted to Supreme Court of NSW (2009)'
    ],
    ARRAY['English', 'Mandarin', 'Cantonese'],
    ARRAY['189 Skilled Independent', '190 Skilled Nominated', '820 Partner', '482 TSS', '500 Student'],
    98.5,
    847,
    4.9,
    156,
    '{
        "monday": {"start": "09:00", "end": "17:00", "available": true},
        "tuesday": {"start": "09:00", "end": "17:00", "available": true},
        "wednesday": {"start": "09:00", "end": "17:00", "available": true},
        "thursday": {"start": "09:00", "end": "17:00", "available": true},
        "friday": {"start": "09:00", "end": "16:00", "available": true},
        "saturday": {"start": "10:00", "end": "14:00", "available": true},
        "sunday": {"available": false}
    }'::jsonb,
    true,
    ARRAY['video', 'phone', 'in_person']
) ON CONFLICT (user_id) DO UPDATE SET
    bio = EXCLUDED.bio,
    specializations = EXCLUDED.specializations,
    success_rate = EXCLUDED.success_rate,
    total_cases = EXCLUDED.total_cases;

-- =====================================================
-- TEST USER 3: REGULAR APPLICANT WITH PROFILE
-- =====================================================
DO $$
DECLARE
    applicant_id UUID := 'a0000000-0000-0000-0000-000000000003'::UUID;
BEGIN
    -- Create auth user
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, 
        created_at, updated_at
    ) VALUES (
        applicant_id,
        'applicant@visabuild.local',
        crypt('applicant123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"James Wilson","first_name":"James","last_name":"Wilson"}'::jsonb,
        'authenticated',
        'authenticated',
        NOW(),
        NOW()
    );
    
    -- Update profile with applicant details
    UPDATE public.profiles 
    SET 
        role = 'user',
        full_name = 'James Wilson',
        phone = '+61 423 456 789',
        is_verified = true,
        nationality = 'United Kingdom',
        current_country = 'United Kingdom',
        preferred_language = 'en',
        timezone = 'Europe/London',
        email_notifications = true,
        push_notifications = true,
        updated_at = NOW()
    WHERE id = applicant_id;
END $$;

-- =====================================================
-- TEST USER 4: ANONYMOUS/TEST USER
-- =====================================================
DO $$
DECLARE
    anon_id UUID := 'a0000000-0000-0000-0000-000000000004'::UUID;
BEGIN
    -- Create auth user
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, 
        created_at, updated_at
    ) VALUES (
        anon_id,
        'anonymous@visabuild.local',
        crypt('anonymous123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Test User","first_name":"Test","last_name":"User"}'::jsonb,
        'authenticated',
        'authenticated',
        NOW(),
        NOW()
    );
    
    -- Update profile
    UPDATE public.profiles 
    SET 
        role = 'user',
        full_name = 'Test User',
        phone = '+61 400 999 999',
        is_verified = true,
        email_notifications = false,
        push_notifications = false,
        updated_at = NOW()
    WHERE id = anon_id;
END $$;

-- =====================================================
-- ADDITIONAL TEST LAWYERS (4 more)
-- =====================================================

-- Lawyer 2: David Chen - Melbourne based
DO $$
DECLARE
    lawyer2_id UUID := 'a0000000-0000-0000-0000-000000000005'::UUID;
BEGIN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, created_at)
    VALUES (lawyer2_id, 'david.chen@visabuild.local', crypt('lawyer123', gen_salt('bf')), NOW(),
        '{"provider":"email"}'::jsonb, '{"full_name":"David Chen"}'::jsonb, 'authenticated', 'authenticated', NOW());
    
    UPDATE public.profiles SET 
        role = 'lawyer', full_name = 'David Chen', phone = '+61 434 567 890',
        bar_number = 'VIC-789012', jurisdiction = 'VIC', 
        practice_areas = ARRAY['Business Migration', 'Investor Visas', 'Global Talent'],
        years_experience = 8, hourly_rate_cents = 42500, is_verified = true
    WHERE id = lawyer2_id;
END $$;

INSERT INTO public.lawyer_profiles (user_id, bio, education, languages, specializations, 
    success_rate, total_cases, average_rating, review_count, is_available)
VALUES ('a0000000-0000-0000-0000-000000000005'::UUID,
    'Business migration specialist with expertise in 188/888 visas and Global Talent pathway.',
    ARRAY['LLB - Monash University', 'GDLP - Leo Cussen Centre'],
    ARRAY['English', 'Mandarin'],
    ARRAY['188 Business Innovation', '888 Business Permanent', '858 Global Talent', '132 Business Talent'],
    96.0, 342, 4.8, 89, true);

-- Lawyer 3: Priya Sharma - Brisbane
DO $$
DECLARE
    lawyer3_id UUID := 'a0000000-0000-0000-0000-000000000006'::UUID;
BEGIN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, created_at)
    VALUES (lawyer3_id, 'priya.sharma@visabuild.local', crypt('lawyer123', gen_salt('bf')), NOW(),
        '{"provider":"email"}'::jsonb, '{"full_name":"Priya Sharma"}'::jsonb, 'authenticated', 'authenticated', NOW());
    
    UPDATE public.profiles SET 
        role = 'lawyer', full_name = 'Priya Sharma', phone = '+61 445 678 901',
        bar_number = 'QLD-345678', jurisdiction = 'QLD',
        practice_areas = ARRAY['Family Migration', 'Partner Visas', 'Parent Visas'],
        years_experience = 15, hourly_rate_cents = 30000, is_verified = true
    WHERE id = lawyer3_id;
END $$;

INSERT INTO public.lawyer_profiles (user_id, bio, education, languages, specializations,
    success_rate, total_cases, average_rating, review_count, is_available)
VALUES ('a0000000-0000-0000-0000-000000000006'::UUID,
    'Family migration expert specialising in partner and parent visas. Compassionate approach to complex family situations.',
    ARRAY['LLB - University of Queensland', 'Masters of Migration Law - UNSW'],
    ARRAY['English', 'Hindi', 'Punjabi'],
    ARRAY['820/801 Partner', '309/100 Partner', '143 Parent', '300 Prospective Marriage'],
    99.2, 1205, 4.9, 287, true);

-- Lawyer 4: Michael O''Brien - Perth
DO $$
DECLARE
    lawyer4_id UUID := 'a0000000-0000-0000-0000-000000000007'::UUID;
BEGIN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, created_at)
    VALUES (lawyer4_id, 'michael.obrien@visabuild.local', crypt('lawyer123', gen_salt('bf')), NOW(),
        '{"provider":"email"}'::jsonb, '{"full_name":"Michael O''Brien"}'::jsonb, 'authenticated', 'authenticated', NOW());
    
    UPDATE public.profiles SET 
        role = 'lawyer', full_name = 'Michael O''Brien', phone = '+61 456 789 012',
        bar_number = 'WA-567890', jurisdiction = 'WA',
        practice_areas = ARRAY['Regional Migration', 'Employer Sponsorship', 'Skilled Migration'],
        years_experience = 6, hourly_rate_cents = 27500, is_verified = true
    WHERE id = lawyer4_id;
END $$;

INSERT INTO public.lawyer_profiles (user_id, bio, education, languages, specializations,
    success_rate, total_cases, average_rating, review_count, is_available)
VALUES ('a0000000-0000-0000-0000-000000000007'::UUID,
    'Regional migration specialist helping businesses and skilled workers in WA. Expert in DAMA agreements.',
    ARRAY['LLB - University of Western Australia'],
    ARRAY['English', 'Irish Gaelic'],
    ARRAY['482 TSS', '494 Regional Employer', '491 Skilled Regional', '186 ENS'],
    94.5, 523, 4.7, 134, true);

-- Lawyer 5: Emma Thompson - Adelaide
DO $$
DECLARE
    lawyer5_id UUID := 'a0000000-0000-0000-0000-000000000008'::UUID;
BEGIN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, created_at)
    VALUES (lawyer5_id, 'emma.thompson@visabuild.local', crypt('lawyer123', gen_salt('bf')), NOW(),
        '{"provider":"email"}'::jsonb, '{"full_name":"Emma Thompson"}'::jsonb, 'authenticated', 'authenticated', NOW());
    
    UPDATE public.profiles SET 
        role = 'lawyer', full_name = 'Emma Thompson', phone = '+61 467 890 123',
        bar_number = 'SA-901234', jurisdiction = 'SA',
        practice_areas = ARRAY['Student Visas', 'Graduate Visas', 'Working Holiday'],
        years_experience = 4, hourly_rate_cents = 22000, is_verified = true
    WHERE id = lawyer5_id;
END $$;

INSERT INTO public.lawyer_profiles (user_id, bio, education, languages, specializations,
    success_rate, total_cases, average_rating, review_count, is_available)
VALUES ('a0000000-0000-0000-0000-000000000008'::UUID,
    'Youth and student migration specialist. Making the visa process simple for students and young professionals.',
    ARRAY['LLB - University of Adelaide'],
    ARRAY['English', 'French'],
    ARRAY['500 Student', '485 Graduate', '417 Working Holiday', '462 Work and Holiday'],
    97.8, 892, 4.9, 201, true);

-- =====================================================
-- ADDITIONAL TEST USERS (3 more)
-- =====================================================

-- User 2: Maria Garcia - Student applicant
DO $$
DECLARE
    user2_id UUID := 'a0000000-0000-0000-0000-000000000009'::UUID;
BEGIN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, created_at)
    VALUES (user2_id, 'maria.garcia@visabuild.local', crypt('applicant123', gen_salt('bf')), NOW(),
        '{"provider":"email"}'::jsonb, '{"full_name":"Maria Garcia"}'::jsonb, 'authenticated', 'authenticated', NOW());
    
    UPDATE public.profiles SET 
        role = 'user', full_name = 'Maria Garcia', phone = '+61 478 901 234',
        nationality = 'Spain', current_country = 'Spain', preferred_language = 'en',
        timezone = 'Europe/Madrid', is_verified = true
    WHERE id = user2_id;
END $$;

-- User 3: Raj Patel - Skilled worker
DO $$
DECLARE
    user3_id UUID := 'a0000000-0000-0000-0000-00000000000a'::UUID;
BEGIN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, created_at)
    VALUES (user3_id, 'raj.patel@visabuild.local', crypt('applicant123', gen_salt('bf')), NOW(),
        '{"provider":"email"}'::jsonb, '{"full_name":"Raj Patel"}'::jsonb, 'authenticated', 'authenticated', NOW());
    
    UPDATE public.profiles SET 
        role = 'user', full_name = 'Raj Patel', phone = '+61 489 012 345',
        nationality = 'India', current_country = 'Singapore', preferred_language = 'en',
        timezone = 'Asia/Singapore', is_verified = true
    WHERE id = user3_id;
END $$;

-- User 4: Yuki Tanaka - Business applicant
DO $$
DECLARE
    user4_id UUID := 'a0000000-0000-0000-0000-00000000000b'::UUID;
BEGIN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, aud, role, created_at)
    VALUES (user4_id, 'yuki.tanaka@visabuild.local', crypt('applicant123', gen_salt('bf')), NOW(),
        '{"provider":"email"}'::jsonb, '{"full_name":"Yuki Tanaka"}'::jsonb, 'authenticated', 'authenticated', NOW());
    
    UPDATE public.profiles SET 
        role = 'user', full_name = 'Yuki Tanaka', phone = '+61 490 123 456',
        nationality = 'Japan', current_country = 'Japan', preferred_language = 'en',
        timezone = 'Asia/Tokyo', is_verified = true
    WHERE id = user4_id;
END $$;

SELECT '✓ Part 2: Test users created' as status,
    (SELECT COUNT(*)::text FROM auth.users WHERE email LIKE '%@visabuild.local') as user_count,
    (SELECT COUNT(*)::text FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email LIKE '%@visabuild.local')) as profile_count,
    (SELECT COUNT(*)::text FROM public.lawyer_profiles WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@visabuild.local')) as lawyer_profile_count;
