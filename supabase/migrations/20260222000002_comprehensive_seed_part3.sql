-- ============================================================================
-- PART 3: SAMPLE DATA FOR TESTING
-- ============================================================================

-- Get visa IDs for reference
WITH visa_ids AS (
    SELECT id, subclass FROM public.visas WHERE subclass IN ('189', '190', '820', '500', '482', '600', '491', '309')
)

-- =====================================================
-- USER APPLICATIONS (2-3 per test user)
-- =====================================================

-- James Wilson's applications
INSERT INTO public.user_applications (
    user_id, visa_id, application_reference, status,
    submitted_at, decision_date, current_step, total_steps, progress_percentage,
    processing_location, notes, has_premium_access
) 
SELECT 
    'a0000000-0000-0000-0000-000000000003'::UUID,
    id,
    'APP-189-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'submitted',
    NOW() - INTERVAL '45 days',
    NULL,
    3, 8, 37,
    'Sydney',
    'Skilled Independent visa application. Points: 75 (Age 30, English Superior, Education 15, Experience 10). Awaiting CO contact.',
    true
FROM public.visas WHERE subclass = '189';

INSERT INTO public.user_applications (
    user_id, visa_id, application_reference, status,
    submitted_at, decision_date, current_step, total_steps, progress_percentage,
    processing_location, notes
) 
SELECT 
    'a0000000-0000-0000-0000-000000000003'::UUID,
    id,
    'APP-190-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'draft',
    NULL,
    NULL,
    1, 8, 12,
    NULL,
    'Exploring NSW nomination pathway as backup. Documents gathering stage.'
FROM public.visas WHERE subclass = '190';

-- Maria Garcia's applications
INSERT INTO public.user_applications (
    user_id, visa_id, application_reference, status,
    submitted_at, decision_date, current_step, total_steps, progress_percentage,
    processing_location, notes, has_premium_access
) 
SELECT 
    'a0000000-0000-0000-0000-000000000009'::UUID,
    id,
    'APP-500-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'approved',
    NOW() - INTERVAL '120 days',
    NOW() - INTERVAL '90 days',
    5, 5, 100,
    'Madrid',
    'Master of Business Administration at University of Melbourne. Visa granted for 2.5 years.',
    true
FROM public.visas WHERE subclass = '500';

INSERT INTO public.user_applications (
    user_id, visa_id, application_reference, status,
    submitted_at, decision_date, current_step, total_steps, progress_percentage,
    processing_location, notes
) 
SELECT 
    'a0000000-0000-0000-0000-000000000009'::UUID,
    id,
    'APP-485-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'draft',
    NULL,
    NULL,
    2, 6, 25,
    NULL,
    'Post-study work visa application. Course completes in 3 months.'
FROM public.visas WHERE subclass = '485';

-- Raj Patel's applications
INSERT INTO public.user_applications (
    user_id, visa_id, application_reference, status,
    submitted_at, decision_date, current_step, total_steps, progress_percentage,
    processing_location, notes, has_premium_access
) 
SELECT 
    'a0000000-0000-0000-0000-00000000000a'::UUID,
    id,
    'APP-482-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'processing',
    NOW() - INTERVAL '25 days',
    NULL,
    3, 6, 50,
    'Singapore',
    'Software Engineer at Atlassian Sydney. Medium-term stream. Employer nomination approved.',
    true
FROM public.visas WHERE subclass = '482';

INSERT INTO public.user_applications (
    user_id, visa_id, application_reference, status,
    submitted_at, decision_date, current_step, total_steps, progress_percentage,
    processing_location, notes
) 
SELECT 
    'a0000000-0000-0000-0000-00000000000a'::UUID,
    id,
    'APP-186-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'draft',
    NULL,
    NULL,
    1, 8, 5,
    NULL,
    'Planning ENS transition after 3 years on 482. Gathering experience evidence.'
FROM public.visas WHERE subclass = '186';

INSERT INTO public.user_applications (
    user_id, visa_id, application_reference, status,
    submitted_at, decision_date, current_step, total_steps, progress_percentage,
    notes
) 
SELECT 
    'a0000000-0000-0000-0000-00000000000a'::UUID,
    id,
    'APP-189-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-002',
    'draft',
    NULL,
    NULL,
    1, 8, 8,
    'EOI submitted with 85 points. Waiting for invitation.'
FROM public.visas WHERE subclass = '189';

-- Yuki Tanaka's applications
INSERT INTO public.user_applications (
    user_id, visa_id, application_reference, status,
    submitted_at, decision_date, current_step, total_steps, progress_percentage,
    processing_location, notes, has_premium_access
) 
SELECT 
    'a0000000-0000-0000-0000-00000000000b'::UUID,
    id,
    'APP-188-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'assessment',
    NOW() - INTERVAL '180 days',
    NULL,
    4, 8, 55,
    'Tokyo',
    'Business Innovation stream. Tech startup founder. Investment committed: $1.2M AUD. State nomination from Victoria secured.',
    true
FROM public.visas WHERE subclass = '188';

-- Test User's applications
INSERT INTO public.user_applications (
    user_id, visa_id, application_reference, status,
    submitted_at, decision_date, current_step, total_steps, progress_percentage,
    notes
) 
SELECT 
    'a0000000-0000-0000-0000-000000000004'::UUID,
    id,
    'APP-600-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'submitted',
    NOW() - INTERVAL '10 days',
    NULL,
    2, 4, 50,
    'Tourism visa for 3-week holiday. Staying with friends in Bondi.'
FROM public.visas WHERE subclass = '600';

-- =====================================================
-- DOCUMENTS (3-4 per user)
-- =====================================================

-- James Wilson's documents
INSERT INTO public.documents (user_id, category_key, name, file_url, file_type, file_size_bytes, status, expiry_date, description) VALUES
('a0000000-0000-0000-0000-000000000003'::UUID, 'identity', 'UK_Passport.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-000000000003/passport.pdf', 'application/pdf', 2456789, 'verified', '2028-03-15', 'UK biometric passport'),
('a0000000-0000-0000-0000-000000000003'::UUID, 'english', 'IELTS_Results.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-000000000003/ielts.pdf', 'application/pdf', 1250000, 'verified', NULL, 'IELTS Academic - Overall 8.0'),
('a0000000-0000-0000-0000-000000000003'::UUID, 'skills_assessment', 'ACS_Assessment.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-000000000003/acs.pdf', 'application/pdf', 3560000, 'verified', NULL, 'ACS Skills Assessment - Software Engineer'),
('a0000000-0000-0000-0000-000000000003'::UUID, 'employment', 'Employment_References.zip', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-000000000003/references.zip', 'application/zip', 8900000, 'pending', NULL, 'Employment reference letters (5 years)');

-- Maria Garcia's documents
INSERT INTO public.documents (user_id, category_key, name, file_url, file_type, file_size_bytes, status, expiry_date, description) VALUES
('a0000000-0000-0000-0000-000000000009'::UUID, 'identity', 'Spanish_Passport.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-000000000009/passport.pdf', 'application/pdf', 2100000, 'verified', '2027-08-22', 'Spanish passport'),
('a0000000-0000-0000-0000-000000000009'::UUID, 'qualifications', 'Bachelor_Degree.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-000000000009/degree.pdf', 'application/pdf', 4200000, 'verified', NULL, 'Bachelor of Business Administration - Universidad de Barcelona'),
('a0000000-0000-0000-0000-000000000009'::UUID, 'financial', 'Bank_Statements.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-000000000009/bank.pdf', 'application/pdf', 5600000, 'verified', NULL, '6 months bank statements - Santander Spain'),
('a0000000-0000-0000-0000-000000000009'::UUID, 'genuine_temporary', 'GTE_Statement.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-000000000009/gte.pdf', 'application/pdf', 1800000, 'verified', NULL, 'Genuine Temporary Entrant statement');

-- Raj Patel's documents
INSERT INTO public.documents (user_id, category_key, name, file_url, file_type, file_size_bytes, status, expiry_date, description) VALUES
('a0000000-0000-0000-0000-00000000000a'::UUID, 'identity', 'Indian_Passport.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-00000000000a/passport.pdf', 'application/pdf', 2300000, 'verified', '2029-01-10', 'Indian passport with Singapore PR'),
('a0000000-0000-0000-0000-00000000000a'::UUID, 'skills_assessment', 'ACS_Positive.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-00000000000a/acs.pdf', 'application/pdf', 4100000, 'verified', NULL, 'ACS Skills Assessment - ICT Business Analyst'),
('a0000000-0000-0000-0000-00000000000a'::UUID, 'english', 'PTE_Results.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-00000000000a/pte.pdf', 'application/pdf', 950000, 'verified', NULL, 'PTE Academic - Overall 79+'),
('a0000000-0000-0000-0000-00000000000a'::UUID, 'employment', 'Atlassian_Offer.pdf', 'https://storage.visabuild.com/docs/a0000000-0000-0000-0000-00000000000a/offer.pdf', 'application/pdf', 1200000, 'verified', NULL, 'Employment contract - Atlassian Pty Ltd');

-- =====================================================
-- BOOKINGS/CONSULTATIONS (2-3 sample bookings)
-- =====================================================

INSERT INTO public.bookings (user_id, lawyer_id, visa_id, booking_date, start_time, end_time, status, amount_cents, notes, meeting_link) 
SELECT 
    'a0000000-0000-0000-0000-000000000003'::UUID,
    p.id,
    v.id,
    CURRENT_DATE + INTERVAL '3 days',
    '10:00:00',
    '11:00:00',
    'confirmed',
    35000,
    'Initial consultation for 189 visa strategy. Questions about points calculation and EOI timing.',
    'https://meet.visabuild.com/sarah-mitchell-001'
FROM public.profiles p, public.visas v
WHERE p.email = 'lawyer@visabuild.local' AND v.subclass = '189';

INSERT INTO public.bookings (user_id, lawyer_id, visa_id, booking_date, start_time, end_time, status, amount_cents, notes) 
SELECT 
    'a0000000-0000-0000-0000-00000000000a'::UUID,
    p.id,
    v.id,
    CURRENT_DATE + INTERVAL '7 days',
    '14:00:00',
    '15:00:00',
    'pending',
    42500,
    'Employer sponsorship pathway discussion. 482 to 186 transition planning.'
FROM public.profiles p, public.visas v
WHERE p.email = 'david.chen@visabuild.local' AND v.subclass = '482';

INSERT INTO public.bookings (user_id, lawyer_id, visa_id, booking_date, start_time, end_time, status, amount_cents, notes, meeting_link) 
SELECT 
    'a0000000-0000-0000-0000-000000000009'::UUID,
    p.id,
    v.id,
    CURRENT_DATE - INTERVAL '5 days',
    '09:30:00',
    '10:00:00',
    'completed',
    22000,
    'Student visa grant notification and post-arrival guidance.',
    'https://meet.visabuild.com/emma-thompson-001'
FROM public.profiles p, public.visas v
WHERE p.email = 'emma.thompson@visabuild.local' AND v.subclass = '500';

-- =====================================================
-- TRACKER ENTRIES (10+ for popular visas)
-- =====================================================

-- 189 Skilled Independent entries
INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight) 
SELECT v.id, p.id, p.role, d.application_date, d.decision_date, 
    (d.decision_date - d.application_date), 'approved', 1.0
FROM public.visas v
CROSS JOIN (
    VALUES 
        ('2025-06-15'::date, '2026-01-20'::date),
        ('2025-07-03'::date, '2026-02-08'::date),
        ('2025-08-12'::date, '2026-02-25'::date),
        ('2025-09-01'::date, NULL),
        ('2025-10-20'::date, NULL)
) AS d(application_date, decision_date)
JOIN public.profiles p ON p.email = 'applicant@visabuild.local'
WHERE v.subclass = '189';

-- Add more 189 entries with different users
INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight) 
SELECT v.id, p.id, p.role, '2025-05-10'::date, '2025-12-18'::date, 222, 'approved', 1.5
FROM public.visas v, public.profiles p
WHERE v.subclass = '189' AND p.email = 'lawyer@visabuild.local';

INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight) 
SELECT v.id, p.id, p.role, '2025-04-22'::date, '2025-11-30'::date, 222, 'approved', 1.0
FROM public.visas v, public.profiles p
WHERE v.subclass = '189' AND p.email = 'maria.garcia@visabuild.local';

-- 820 Partner visa entries (longer processing times)
INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight) 
SELECT v.id, p.id, p.role, d.application_date, d.decision_date,
    CASE WHEN d.decision_date IS NOT NULL THEN (d.decision_date - d.application_date) ELSE NULL END,
    CASE WHEN d.decision_date IS NOT NULL THEN 'approved' ELSE 'pending' END, 1.0
FROM public.visas v
CROSS JOIN (
    VALUES 
        ('2024-03-10'::date, '2025-08-15'::date),
        ('2024-06-20'::date, '2025-11-30'::date),
        ('2025-01-15'::date, NULL),
        ('2025-05-08'::date, NULL)
) AS d(application_date, decision_date)
JOIN public.profiles p ON p.email IN ('applicant@visabuild.local', 'anonymous@visabuild.local')
WHERE v.subclass = '820';

-- 190 Skilled Nominated entries
INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight) 
SELECT v.id, p.id, p.role, d.application_date, d.decision_date,
    (d.decision_date - d.application_date), 'approved', 1.0
FROM public.visas v
CROSS JOIN (
    VALUES 
        ('2025-07-01'::date, '2026-01-25'::date),
        ('2025-08-15'::date, '2026-02-10'::date),
        ('2025-09-20'::date, NULL)
) AS d(application_date, decision_date)
JOIN public.profiles p ON p.email = 'raj.patel@visabuild.local'
WHERE v.subclass = '190';

-- 500 Student visa entries (faster processing)
INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight) 
SELECT v.id, p.id, p.role, d.application_date, d.decision_date,
    (d.decision_date - d.application_date), 'approved', 1.0
FROM public.visas v
CROSS JOIN (
    VALUES 
        ('2025-11-01'::date, '2025-11-15'::date),
        ('2025-11-05'::date, '2025-11-20'::date),
        ('2025-12-01'::date, NULL),
        ('2025-12-10'::date, NULL)
) AS d(application_date, decision_date)
JOIN public.profiles p ON p.email IN ('maria.garcia@visabuild.local', 'yuki.tanaka@visabuild.local')
WHERE v.subclass = '500';

-- =====================================================
-- SAVED VISAS (for test users)
-- =====================================================

INSERT INTO public.saved_visas (user_id, visa_id, notes)
SELECT 'a0000000-0000-0000-0000-000000000003'::UUID, id, 'Primary target - 75 points'
FROM public.visas WHERE subclass = '189';

INSERT INTO public.saved_visas (user_id, visa_id, notes)
SELECT 'a0000000-0000-0000-0000-000000000003'::UUID, id, 'Backup option - NSW nomination'
FROM public.visas WHERE subclass = '190';

INSERT INTO public.saved_visas (user_id, visa_id, notes)
SELECT 'a0000000-0000-0000-0000-00000000000a'::UUID, id, 'Current employer sponsor'
FROM public.visas WHERE subclass = '482';

INSERT INTO public.saved_visas (user_id, visa_id, notes)
SELECT 'a0000000-0000-0000-0000-00000000000a'::UUID, id, 'Future PR pathway'
FROM public.visas WHERE subclass = '186';

INSERT INTO public.saved_visas (user_id, visa_id, notes)
SELECT 'a0000000-0000-0000-0000-00000000000b'::UUID, id, 'Business expansion plans'
FROM public.visas WHERE subclass = '188';

INSERT INTO public.saved_visas (user_id, visa_id, notes)
SELECT 'a0000000-0000-0000-0000-000000000009'::UUID, id, 'Post-study work option'
FROM public.visas WHERE subclass = '485';

SELECT '✓ Part 3: Sample data created' as status,
    (SELECT COUNT(*)::text FROM public.user_applications) as applications,
    (SELECT COUNT(*)::text FROM public.documents) as documents,
    (SELECT COUNT(*)::text FROM public.bookings) as bookings,
    (SELECT COUNT(*)::text FROM public.tracker_entries) as tracker_entries,
    (SELECT COUNT(*)::text FROM public.saved_visas) as saved_visas;
