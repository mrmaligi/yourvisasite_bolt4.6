-- ============================================================================
-- COMPREHENSIVE DATABASE SEED DATA
-- Issue #156 Fix: Seeds database with sample data for development/testing
-- ============================================================================

-- ============================================================================
-- 001: CREATE TEST USERS (Auth + Profiles)
-- ============================================================================

-- Anonymous User (for public browsing without login)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'anonymous@visabuild.local',
    crypt('anonymous123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Anonymous User"}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (
    id, email, role, full_name, is_active, is_verified, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'anonymous@visabuild.local',
    'user',
    'Anonymous User',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Test Applicant/User
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'applicant@visabuild.local',
    crypt('applicant123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"John Applicant"}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (
    id, email, role, full_name, phone, nationality, current_country, 
    is_active, is_verified, referral_code, created_at, updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'applicant@visabuild.local',
    'user',
    'John Applicant',
    '+61 400 123 456',
    'India',
    'Australia',
    true,
    true,
    'APPL1234',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Test Lawyer
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'lawyer@visabuild.local',
    crypt('lawyer123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Sarah Lawyer"}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (
    id, email, role, full_name, phone, is_active, is_verified, created_at, updated_at
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'lawyer@visabuild.local',
    'lawyer',
    'Sarah Lawyer',
    '+61 400 987 654',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO lawyer_profiles (
    user_id, bar_number, jurisdiction, years_experience, specializations, languages_spoken,
    verification_status, bio, education, hourly_rate_cents, consultation_fee_cents,
    is_available, is_taking_new_clients, average_rating, total_reviews, total_clients, created_at
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'MARN 1234567',
    'New South Wales',
    10,
    ARRAY['Skilled Visas', 'Partner Visas', 'Student Visas'],
    ARRAY['English', 'Mandarin'],
    'approved',
    'Experienced migration lawyer with 10+ years helping families and professionals navigate Australian immigration. Specializing in skilled migration and partner visas.',
    'Bachelor of Laws - University of Sydney, Graduate Diploma in Migration Law',
    30000,
    15000,
    true,
    true,
    4.8,
    25,
    120,
    NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- Test Admin
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'admin@visabuild.local',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin User"}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (
    id, email, role, full_name, phone, is_active, is_verified, created_at, updated_at
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    'admin@visabuild.local',
    'admin',
    'Admin User',
    '+61 400 111 222',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Second Test User (for testing user interactions)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '44444444-4444-4444-4444-444444444444',
    'authenticated',
    'authenticated',
    'user2@visabuild.local',
    crypt('user2123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Jane User"}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (
    id, email, role, full_name, phone, nationality, current_country,
    is_active, is_verified, referral_code, created_at, updated_at
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    'user2@visabuild.local',
    'user',
    'Jane User',
    '+61 400 333 444',
    'United Kingdom',
    'Australia',
    true,
    true,
    'USER5678',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 002: CREATE SAMPLE APPLICATIONS FOR APPLICANTS
-- ============================================================================

-- Only insert if visas exist
DO $$
BEGIN
    -- Application for John Applicant (189 Visa)
    IF EXISTS (SELECT 1 FROM visas WHERE subclass = '189') THEN
        INSERT INTO user_applications (
            user_id, visa_id, application_reference, status, submitted_at,
            processing_location, current_step, total_steps, progress_percentage,
            has_premium_access, premium_access_granted_at
        ) 
        SELECT 
            '11111111-1111-1111-1111-111111111111',
            v.id,
            'APP-' || substr(md5(random()::text), 1, 8),
            'processing',
            '2025-01-15'::date,
            'Sydney',
            3,
            5,
            60,
            true,
            '2025-01-15'::date
        FROM visas v
        WHERE v.subclass = '189'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;

    -- Draft application for 820 Visa
    IF EXISTS (SELECT 1 FROM visas WHERE subclass = '820') THEN
        INSERT INTO user_applications (
            user_id, visa_id, application_reference, status, submitted_at,
            processing_location, current_step, total_steps, progress_percentage
        )
        SELECT 
            '11111111-1111-1111-1111-111111111111',
            v.id,
            'APP-' || substr(md5(random()::text), 1, 8),
            'draft',
            NULL,
            NULL,
            1,
            5,
            20
        FROM visas v
        WHERE v.subclass = '820'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;

    -- Application for Jane User
    IF EXISTS (SELECT 1 FROM visas WHERE subclass = '190') THEN
        INSERT INTO user_applications (
            user_id, visa_id, application_reference, status, submitted_at,
            processing_location, current_step, total_steps, progress_percentage
        )
        SELECT 
            '44444444-4444-4444-4444-444444444444',
            v.id,
            'APP-' || substr(md5(random()::text), 1, 8),
            'submitted',
            '2025-02-01'::date,
            'Melbourne',
            2,
            5,
            40
        FROM visas v
        WHERE v.subclass = '190'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- 003: CREATE SAMPLE DOCUMENTS
-- ============================================================================

INSERT INTO documents (
    user_id, document_type, document_name, file_name, file_path, file_url, 
    file_size, file_type, status, uploaded_at
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'passport',
    'Passport - John Applicant',
    'passport.pdf',
    'documents/11111111-1111-1111-1111-111111111111/passport.pdf',
    'https://storage.supabase.co/documents/passport.pdf',
    2048000,
    'application/pdf',
    'verified',
    NOW()
),
(
    '11111111-1111-1111-1111-111111111111',
    'degree',
    'Bachelor Degree Certificate',
    'degree.pdf',
    'documents/11111111-1111-1111-1111-111111111111/degree.pdf',
    'https://storage.supabase.co/documents/degree.pdf',
    1536000,
    'application/pdf',
    'pending',
    NOW()
),
(
    '44444444-4444-4444-4444-444444444444',
    'passport',
    'Passport - Jane User',
    'passport_jane.pdf',
    'documents/44444444-4444-4444-4444-444444444444/passport.pdf',
    'https://storage.supabase.co/documents/passport_jane.pdf',
    1892000,
    'application/pdf',
    'verified',
    NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 004: CREATE SAMPLE CONSULTATION BOOKINGS
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM lawyer_profiles WHERE user_id = '22222222-2222-2222-2222-222222222222') THEN
        INSERT INTO bookings (
            user_id, lawyer_id, booking_reference, status, scheduled_at, duration_minutes,
            meeting_type, meeting_link, amount_cents, is_paid, topic, notes
        )
        SELECT 
            '11111111-1111-1111-1111-111111111111',
            lp.id,
            'BK-' || substr(md5(random()::text), 1, 8),
            'confirmed',
            NOW() + interval '3 days',
            60,
            'video',
            'https://meet.visabuild.com/test-meeting',
            15000,
            true,
            '189 Visa Consultation',
            'Need advice on points calculation and documents'
        FROM lawyer_profiles lp
        WHERE lp.user_id = '22222222-2222-2222-2222-222222222222'
        LIMIT 1
        ON CONFLICT DO NOTHING;

        -- Another booking for Jane User
        INSERT INTO bookings (
            user_id, lawyer_id, booking_reference, status, scheduled_at, duration_minutes,
            meeting_type, amount_cents, is_paid, topic
        )
        SELECT 
            '44444444-4444-4444-4444-444444444444',
            lp.id,
            'BK-' || substr(md5(random()::text), 1, 8),
            'pending',
            NOW() + interval '5 days',
            30,
            'phone',
            7500,
            false,
            '190 Visa Eligibility Check'
        FROM lawyer_profiles lp
        WHERE lp.user_id = '22222222-2222-2222-2222-222222222222'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- 005: CREATE TRACKER ENTRIES
-- ============================================================================

DO $$
BEGIN
    -- Tracker entry for John Applicant
    IF EXISTS (SELECT 1 FROM visas WHERE subclass = '189') THEN
        INSERT INTO tracker_entries (
            user_id, visa_id, location, application_date, decision_date, 
            outcome, is_priority, is_verified, weight, notes
        )
        SELECT 
            '11111111-1111-1111-1111-111111111111',
            v.id,
            'India',
            '2024-08-01',
            '2024-11-15',
            'approved',
            'standard',
            true,
            3,
            'Smooth process, no additional documents requested'
        FROM visas v
        WHERE v.subclass = '189'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;

    IF EXISTS (SELECT 1 FROM visas WHERE subclass = '820') THEN
        INSERT INTO tracker_entries (
            user_id, visa_id, location, application_date, 
            outcome, is_priority, is_verified, weight
        )
        SELECT 
            '11111111-1111-1111-1111-111111111111',
            v.id,
            'United Kingdom',
            '2025-01-10',
            'pending',
            'priority',
            false,
            1
        FROM visas v
        WHERE v.subclass = '820'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;

    -- Tracker entry for Jane User
    IF EXISTS (SELECT 1 FROM visas WHERE subclass = '491') THEN
        INSERT INTO tracker_entries (
            user_id, visa_id, location, application_date, decision_date,
            outcome, is_priority, is_verified, weight, notes
        )
        SELECT 
            '44444444-4444-4444-4444-444444444444',
            v.id,
            'United Kingdom',
            '2024-06-15',
            '2024-12-20',
            'approved',
            'standard',
            true,
            2,
            'Regional visa granted, moving to Adelaide'
        FROM visas v
        WHERE v.subclass = '491'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- 006: CREATE FORUM CATEGORIES AND TOPICS
-- ============================================================================

-- Create forum categories if they don't exist
INSERT INTO forum_categories (name, slug, description, sort_order, created_at)
VALUES 
    ('General Discussion', 'general', 'General visa and immigration discussions', 1, NOW()),
    ('Skilled Visas', 'skilled-visas', 'Discussion about skilled migration visas', 2, NOW()),
    ('Partner Visas', 'partner-visas', 'Discussion about partner and family visas', 3, NOW()),
    ('Student Visas', 'student-visas', 'Discussion about student visas', 4, NOW()),
    ('Lawyer Q&A', 'lawyer-qa', 'Ask questions to registered migration lawyers', 5, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Create sample forum topics
DO $$
DECLARE
    general_category_id UUID;
    skilled_category_id UUID;
BEGIN
    SELECT id INTO general_category_id FROM forum_categories WHERE slug = 'general' LIMIT 1;
    SELECT id INTO skilled_category_id FROM forum_categories WHERE slug = 'skilled-visas' LIMIT 1;

    IF general_category_id IS NOT NULL THEN
        INSERT INTO forum_topics (
            category_id, author_id, title, slug, content, 
            view_count, reply_count, created_at
        )
        VALUES (
            general_category_id,
            '11111111-1111-1111-1111-111111111111',
            'My 189 visa timeline - 3 months and counting',
            'my-189-visa-timeline',
            E'Hi everyone!\n\nI wanted to share my 189 visa journey so far:\n\n- Lodged: 15 Aug 2024\n- Received acknowledgement: Same day\n- Medical requested: 1 Sep 2024\n- Medical completed: 10 Sep 2024\n- Status: Currently processing\n\nHas anyone had similar timelines? Any idea when I might hear back?\n\nOccupation: Software Engineer (261313)\nPoints: 85\nLocation: Applied from India',
            45,
            1,
            NOW() - interval '2 days'
        )
        ON CONFLICT DO NOTHING;
    END IF;

    IF skilled_category_id IS NOT NULL THEN
        INSERT INTO forum_topics (
            category_id, author_id, title, slug, content,
            view_count, reply_count, created_at
        )
        VALUES (
            skilled_category_id,
            '44444444-4444-4444-4444-444444444444',
            'Points calculation for 190 visa - confused about skilled employment',
            '190-points-calculation-help',
            E'Hi all,\n\nI''m trying to calculate my points for the 190 visa but I''m confused about the skilled employment criteria.\n\nI have 5 years of experience as a nurse in the UK. Does all of this count as "skilled employment"?\n\nAlso, my occupation is on the MLTSSL list - does that give me any extra points?\n\nAny help would be appreciated!',
            23,
            0,
            NOW() - interval '1 day'
        )
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Create sample forum replies
DO $$
DECLARE
    topic_id UUID;
BEGIN
    SELECT id INTO topic_id FROM forum_topics WHERE slug = 'my-189-visa-timeline' LIMIT 1;
    
    IF topic_id IS NOT NULL THEN
        INSERT INTO forum_replies (
            topic_id, author_id, content, created_at
        )
        VALUES (
            topic_id,
            '22222222-2222-2222-2222-222222222222',
            E'Hi John,\n\nThanks for sharing your timeline. Based on recent trends, 189 visas for Software Engineers are taking 6-9 months currently.\n\nYour medical clearance is a good sign - that''s often one of the last checks before decision.\n\nHang in there!\n\n- Sarah',
            NOW() - interval '1 day'
        )
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- 007: CREATE SAVED VISAS
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM visas WHERE subclass = '190') THEN
        INSERT INTO saved_visas (user_id, visa_id, notes, created_at)
        SELECT 
            '11111111-1111-1111-1111-111111111111',
            v.id,
            'High points score needed but good pathway to PR',
            NOW()
        FROM visas v
        WHERE v.subclass = '190'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;

    IF EXISTS (SELECT 1 FROM visas WHERE subclass = '491') THEN
        INSERT INTO saved_visas (user_id, visa_id, notes, created_at)
        SELECT 
            '11111111-1111-1111-1111-111111111111',
            v.id,
            'Backup option if 189 doesnt work out',
            NOW()
        FROM visas v
        WHERE v.subclass = '491'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;

    IF EXISTS (SELECT 1 FROM visas WHERE subclass = '189') THEN
        INSERT INTO saved_visas (user_id, visa_id, notes, created_at)
        SELECT 
            '44444444-4444-4444-4444-444444444444',
            v.id,
            'Dream visa - aiming for 85+ points',
            NOW()
        FROM visas v
        WHERE v.subclass = '189'
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- 008: CREATE LAWYER AVAILABILITY
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM lawyer_profiles WHERE user_id = '22222222-2222-2222-2222-222222222222') THEN
        INSERT INTO lawyer_availability (lawyer_id, day_of_week, start_time, end_time, is_available)
        SELECT 
            lp.id,
            day.day_of_week,
            day.start_time,
            day.end_time,
            true
        FROM lawyer_profiles lp
        CROSS JOIN (VALUES 
            (1, '09:00', '17:00'),
            (2, '09:00', '17:00'),
            (3, '09:00', '17:00'),
            (4, '09:00', '17:00'),
            (5, '09:00', '15:00')
        ) AS day(day_of_week, start_time, end_time)
        WHERE lp.user_id = '22222222-2222-2222-2222-222222222222'
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- 009: CREATE NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (user_id, type, title, message, action_url, is_read, created_at)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'in_app',
    'Welcome to VisaBuild!',
    'Complete your profile to get personalized visa recommendations.',
    '/dashboard/settings',
    false,
    NOW() - interval '1 day'
),
(
    '11111111-1111-1111-1111-111111111111',
    'in_app',
    'Document uploaded successfully',
    'Your passport has been verified by our team.',
    '/dashboard/documents',
    true,
    NOW() - interval '12 hours'
),
(
    '22222222-2222-2222-2222-222222222222',
    'in_app',
    'New consultation booked',
    'John Applicant booked a consultation for tomorrow at 2PM.',
    '/lawyer/consultations',
    false,
    NOW() - interval '2 hours'
),
(
    '44444444-4444-4444-4444-444444444444',
    'in_app',
    'Welcome to VisaBuild!',
    'Start exploring visa options for your situation.',
    '/visas',
    false,
    NOW() - interval '3 hours'
),
(
    '44444444-4444-4444-4444-444444444444',
    'in_app',
    'Application submitted',
    'Your 190 visa application has been successfully submitted.',
    '/dashboard/applications',
    true,
    NOW() - interval '1 hour'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 010: UPDATE LAWYER STATS
-- ============================================================================

UPDATE lawyer_profiles 
SET 
    total_clients = 120,
    total_consultations = 85,
    total_reviews = 25,
    average_rating = 4.8,
    profile_views = 456
WHERE user_id = '22222222-2222-2222-2222-222222222222';

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT 'Seed data created successfully!' as status;

SELECT 
    'Users created:' as info,
    COUNT(*) as count 
FROM profiles 
WHERE id IN (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444'
);

SELECT 
    'Summary:' as info,
    (SELECT COUNT(*) FROM profiles) as total_profiles,
    (SELECT COUNT(*) FROM user_applications) as applications,
    (SELECT COUNT(*) FROM documents) as documents,
    (SELECT COUNT(*) FROM bookings) as bookings,
    (SELECT COUNT(*) FROM tracker_entries) as tracker_entries,
    (SELECT COUNT(*) FROM forum_topics) as forum_topics,
    (SELECT COUNT(*) FROM forum_replies) as forum_replies,
    (SELECT COUNT(*) FROM notifications) as notifications,
    (SELECT COUNT(*) FROM saved_visas) as saved_visas;
