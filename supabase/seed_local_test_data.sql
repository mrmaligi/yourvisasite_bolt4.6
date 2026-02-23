-- ============================================================================
-- LOCAL TEST DATA SETUP
-- Creates 4 user types for testing: Admin, Lawyer, Applicant, Anonymous
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
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'applicant@visabuild.local',
    crypt('applicant123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
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
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'lawyer@visabuild.local',
    crypt('lawyer123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
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
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'admin@visabuild.local',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
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

-- ============================================================================
-- 002: CREATE SAMPLE APPLICATIONS FOR APPLICANT
-- ============================================================================

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
LIMIT 1;

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
LIMIT 1;

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
);

-- ============================================================================
-- 004: CREATE SAMPLE CONSULTATION BOOKINGS
-- ============================================================================

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
LIMIT 1;

-- ============================================================================
-- 005: CREATE TRACKER ENTRIES
-- ============================================================================

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
LIMIT 1;

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
LIMIT 1;

-- ============================================================================
-- 006: CREATE FORUM ACTIVITY
-- ============================================================================

INSERT INTO forum_topics (
    category_id, author_id, title, slug, content, 
    view_count, reply_count, created_at
)
SELECT 
    fc.id,
    '11111111-1111-1111-1111-111111111111',
    'My 189 visa timeline - 3 months and counting',
    'my-189-visa-timeline',
    E'Hi everyone!\n\nI wanted to share my 189 visa journey so far:\n\n- Lodged: 15 Aug 2024\n- Received acknowledgement: Same day\n- Medical requested: 1 Sep 2024\n- Medical completed: 10 Sep 2024\n- Status: Currently processing\n\nHas anyone had similar timelines? Any idea when I might hear back?\n\nOccupation: Software Engineer (261313)\nPoints: 85\nLocation: Applied from India',
    45,
    8,
    NOW() - interval '2 days'
FROM forum_categories fc
WHERE fc.slug = 'general'
LIMIT 1;

INSERT INTO forum_replies (
    topic_id, author_id, content, created_at
)
SELECT 
    ft.id,
    '22222222-2222-2222-2222-222222222222',
    E'Hi John,\n\nThanks for sharing your timeline. Based on recent trends, 189 visas for Software Engineers are taking 6-9 months currently.\n\nYour medical clearance is a good sign - that\'s often one of the last checks before decision.\n\nHang in there!\n\n- Sarah',
    NOW() - interval '1 day'
FROM forum_topics ft
WHERE ft.slug = 'my-189-visa-timeline'
LIMIT 1;

-- ============================================================================
-- 007: CREATE SAVED VISAS
-- ============================================================================

INSERT INTO saved_visas (user_id, visa_id, notes, created_at)
SELECT 
    '11111111-1111-1111-1111-111111111111',
    v.id,
    'High points score needed but good pathway to PR',
    NOW()
FROM visas v
WHERE v.subclass = '190'
LIMIT 1;

INSERT INTO saved_visas (user_id, visa_id, notes, created_at)
SELECT 
    '11111111-1111-1111-1111-111111111111',
    v.id,
    'Backup option if 189 doesnt work out',
    NOW()
FROM visas v
WHERE v.subclass = '491'
LIMIT 1;

-- ============================================================================
-- 008: CREATE LAWYER AVAILABILITY
-- ============================================================================

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
WHERE lp.user_id = '22222222-2222-2222-2222-222222222222';

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
);

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
-- DONE - Test Data Created
-- ============================================================================

SELECT 'Test users created:' as status;
SELECT role, email, full_name FROM profiles WHERE id IN (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333'
);

SELECT 'Summary:' as info;
SELECT 
    (SELECT COUNT(*) FROM profiles) as total_profiles,
    (SELECT COUNT(*) FROM user_applications) as applications,
    (SELECT COUNT(*) FROM documents) as documents,
    (SELECT COUNT(*) FROM bookings) as bookings,
    (SELECT COUNT(*) FROM tracker_entries) as tracker_entries,
    (SELECT COUNT(*) FROM forum_topics) as forum_topics,
    (SELECT COUNT(*) FROM notifications) as notifications;

