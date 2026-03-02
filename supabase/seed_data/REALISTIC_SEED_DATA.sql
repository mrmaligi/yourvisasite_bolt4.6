-- ============================================================================
-- REALISTIC SEED DATA FOR VISABUILD
-- Populates the database with realistic content for demo/testing
-- ============================================================================

-- ============================================================================
-- 001: LAWYER PROFILES (10 realistic Australian migration lawyers)
-- ============================================================================

-- First, create auth users for lawyers (these would normally be created through signup)
-- For seeding, we'll reference existing user IDs or create placeholder references

INSERT INTO lawyer_profiles (
    user_id,
    bar_number,
    jurisdiction,
    years_experience,
    specializations,
    languages_spoken,
    verification_status,
    bio,
    education,
    hourly_rate_cents,
    consultation_fee_cents,
    is_available,
    average_rating,
    total_reviews,
    total_clients
) VALUES 
-- Lawyer 1
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef001', 'MARN 1578294', 'New South Wales', 12, 
 ARRAY['Skilled Visas', 'Employer Sponsorship', 'ENS 186'], 
 ARRAY['English', 'Mandarin'],
 'approved',
 'Specialist in skilled migration and employer sponsorship. 12 years experience helping professionals secure Australian visas. Former senior case officer at Department of Home Affairs.',
 'Bachelor of Laws (LLB) - University of Sydney, Graduate Diploma in Migration Law - ANU',
 35000, -- $350/hour
 20000,  -- $200 consultation
 true, 4.9, 47, 156),

-- Lawyer 2
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef002', 'MARN 1384592', 'Victoria',
 8,
 ARRAY['Partner Visas', 'Family Migration', 'Parent Visas'],
 ARRAY['English', 'Hindi', 'Punjabi'],
 'approved',
 'Dedicated family migration specialist. Helping couples and families reunite in Australia. High success rate in complex partner visa cases.',
 'Bachelor of Laws - Monash University, Graduate Certificate in Migration Law',
 28000,
 15000,
 true, 4.8, 34, 89),

-- Lawyer 3
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef003', 'MARN 1428573', 'Queensland',
 15,
 ARRAY['Student Visas', 'Graduate Visas', 'Temporary Visas'],
 ARRAY['English', 'Vietnamese'],
 'approved',
 'Education pathway specialist. 15 years helping international students achieve their Australian dreams. Former university international office advisor.',
 'LLB - University of Queensland, Master of Migration Law',
 25000,
 12000,
 true, 4.7, 52, 203),

-- Lawyer 4
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef004', 'MARN 1693847', 'Western Australia',
 6,
 ARRAY['Business Visas', 'Investor Visas', 'Global Talent'],
 ARRAY['English', 'Cantonese'],
 'approved',
 'Business migration expert specializing in 188/888 visas and Global Talent program. Helped over 50 business owners establish in Australia.',
 'Bachelor of Commerce/Bachelor of Laws - UWA',
 45000,
 30000,
 true, 4.9, 28, 67),

-- Lawyer 5
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef005', 'MARN 1738294', 'South Australia',
 9,
 ARRAY['Regional Visas', '491 Visas', '494 Visas'],
 ARRAY['English', 'Arabic'],
 'approved',
 'Regional migration specialist. Deep knowledge of South Australia and regional visa pathways. Strong relationships with regional employers.',
 'LLB - University of Adelaide, Grad Dip Migration Law',
 22000,
 10000,
 true, 4.6, 19, 78),

-- Lawyer 6
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef006', 'MARN 1582934', 'New South Wales',
 11,
 ARRAY['Work Visas', '482 TSS', 'Labour Agreements'],
 ARRAY['English', 'Spanish'],
 'approved',
 'Employer-sponsored visa specialist. Expert in 482 TSS, 186 ENS, and labour agreements. Former immigration department liaison.',
 'LLB - UNSW, Grad Dip Migration Law',
 32000,
 18000,
 true, 4.8, 41, 134),

-- Lawyer 7 (pending verification)
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef007', 'MARN 1928475', 'Victoria',
 3,
 ARRAY['General Migration', 'Visitor Visas'],
 ARRAY['English', 'Mandarin'],
 'pending',
 'Rising star in migration law. 3 years experience with strong academic background. Special interest in visitor and working holiday visas.',
 'LLB - University of Melbourne, Grad Dip Migration Law',
 18000,
 8000,
 false, 0, 0, 0),

-- Lawyer 8
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef008', 'MARN 1657382', 'New South Wales',
 20,
 ARRAY['Complex Cases', 'AAT Appeals', 'Refusals'],
 ARRAY['English', 'Greek'],
 'approved',
 'Senior migration lawyer specializing in complex cases and appeals. 20 years experience. High success rate at AAT and Federal Circuit Court.',
 'LLB - University of Sydney, Master of Migration Law',
 50000,
 35000,
 true, 5.0, 89, 245),

-- Lawyer 9
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef009', 'MARN 1475839', 'Queensland',
 7,
 ARRAY['Health Professional Visas', 'Occupational Trainee'],
 ARRAY['English', 'Korean'],
 'approved',
 'Healthcare migration specialist. Extensive experience with doctors, nurses, and allied health professionals. Former hospital HR manager.',
 'LLB - QUT, Grad Dip Migration Law',
 26000,
 14000,
 true, 4.7, 23, 92),

-- Lawyer 10
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef010', 'MARN 1827463', 'Western Australia',
 14,
 ARRAY['Corporate Migration', 'Global Mobility', '457 to PR'],
 ARRAY['English', 'French', 'German'],
 'approved',
 'Corporate immigration expert. Managed migration programs for Fortune 500 companies. Specialist in executive and senior professional visas.',
 'LLB - Murdoch University, MBA - UWA',
 55000,
 40000,
 true, 4.9, 67, 189);

-- ============================================================================
-- 002: TRACKER ENTRIES (Realistic processing times based on 2024-2025 data)
-- ============================================================================

-- Get visa IDs first (assuming they're already seeded)
-- Creating tracker entries for realistic scenarios

INSERT INTO tracker_entries (
    user_id,
    visa_id,
    location,
    application_date,
    decision_date,
    outcome,
    is_priority,
    is_verified,
    weight,
    notes
)
SELECT 
    gen_random_uuid(),
    v.id,
    CASE random() * 5 
        WHEN 0 THEN 'India'
        WHEN 1 THEN 'China'
        WHEN 2 THEN 'United Kingdom'
        WHEN 3 THEN 'Philippines'
        ELSE 'United States'
    END,
    '2024-08-15'::date + (random() * 180)::int,
    '2024-10-20'::date + (random() * 180)::int,
    CASE WHEN random() > 0.15 THEN 'approved' ELSE 'refused' END,
    CASE WHEN random() > 0.8 THEN 'priority' ELSE 'standard' END,
    true,
    3, -- Verified entries have higher weight
    'Real user submission'
FROM visas v
WHERE v.subclass IN ('189', '190', '491', '482', '500', '820', '600', '485')
LIMIT 150;

-- ============================================================================
-- 003: NEWS ARTICLES (10 realistic immigration news articles)
-- ============================================================================

INSERT INTO news_articles (
    title,
    slug,
    content,
    summary,
    author_id,
    published_at,
    is_published,
    view_count
) VALUES 
(
    'Australia Announces Record Immigration Program for 2024-25',
    'record-immigration-program-2024-25',
    E'The Australian Government has announced a record immigration program for 2024-25, with a planning level of 185,000 permanent places.\n\nKey highlights:\n- 70% of places allocated to skilled stream\n- Focus on addressing critical skill shortages\n- Regional visas receive priority processing\n- Partner and family visas maintain consistent levels\n\nThe program aims to support economic recovery while maintaining sustainable population growth.',
    '185,000 permanent places announced with 70% for skilled migration',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef001',
    '2024-12-15 09:00:00',
    true,
    2340
),
(
    'Processing Times Improve for Partner Visas',
    'partner-visa-processing-times-improve',
    E'Partner visa processing times have shown significant improvement in recent months, with many applicants receiving decisions within 6-12 months.\n\nThe Department of Home Affairs has streamlined assessment processes and allocated additional resources to the partner visa program.\n\nCurrent processing estimates:\n- Onshore Partner (820/801): 12-18 months\n- Offshore Partner (309/100): 12-16 months\n- Prospective Marriage (300): 10-14 months',
    'Streamlined processes reduce waiting times for partner visa applicants',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef002',
    '2025-01-10 14:30:00',
    true,
    1892
),
(
    'Skilled Occupation List Updated for 2025',
    'skilled-occupation-list-updated-2025',
    E'The Australian Government has released the updated skilled occupation list for 2025, adding 15 new occupations and removing 8 that are no longer in shortage.\n\nNew additions include:\n- Cyber Security Specialist\n- Data Scientist\n- Aged Care Registered Nurse\n- Construction Project Manager\n\nThe changes reflect evolving workforce needs and technological advancement.',
    '15 new occupations added to address emerging skill shortages',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef003',
    '2025-01-25 11:00:00',
    true,
    3241
),
(
    'Student Visa Requirements Tightened for 2025',
    'student-visa-requirements-tightened',
    E'New measures have been introduced to strengthen the integrity of Australia''s international education sector.\n\nKey changes:\n- Increased financial capacity requirements\n- Enhanced English language proficiency standards\n- Stricter Genuine Temporary Entrant assessments\n- New monitoring of education providers\n\nThe changes aim to ensure quality education and protect student welfare.',
    'Enhanced requirements to protect education sector integrity',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef001',
    '2025-02-05 16:45:00',
    true,
    4567
),
(
    'Regional Migration Boom: 30% Increase in 491 Visas',
    'regional-migration-boom-491-visas',
    E'Regional Australia is experiencing a migration boom, with a 30% increase in 491 Skilled Work Regional visa grants compared to last year.\n\nPopular regional destinations:\n- Perth, WA\n- Adelaide, SA\n- Gold Coast, QLD\n- Wollongong, NSW\n\nThe regional visa pathway offers:\n- Priority processing\n- Additional points for permanent residency\n- Lower requirements than metropolitan areas',
    '30% increase in regional visa grants as migrants seek lifestyle benefits',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef004',
    '2025-02-10 09:15:00',
    true,
    2156
),
(
    'Global Talent Visa: 10,000 Places Available',
    'global-talent-visa-10000-places',
    E'The Global Talent Independent (GTI) program continues to attract exceptional talent to Australia, with 10,000 places available in 2024-25.\n\nTarget sectors:\n- Resources\n- Agri-food and AgTech\n- Energy\n- Health industries\n- Defence, advanced manufacturing and space\n- Circular economy\n- Digitech\n- Education\n\nCandidates must demonstrate international recognition and earn above the high-income threshold.',
    '10,000 places for exceptional talent in priority sectors',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef005',
    '2024-12-20 10:30:00',
    true,
    1789
),
(
    'Working Holiday Visa Age Limit Extended to 35',
    'working-holiday-age-limit-extended',
    E'In a welcome change for young professionals, the age limit for Working Holiday (subclass 417) and Work and Holiday (subclass 462) visas has been extended to 35 years for many countries.\n\nPreviously limited to applicants aged 18-30, the extension recognizes changing career patterns and allows more experienced young professionals to experience Australia.\n\nEligible countries now include the UK, France, Canada, and Ireland with the extended age limit.',
    'Age limit raised from 30 to 35 for key partner countries',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef006',
    '2025-01-15 13:20:00',
    true,
    3892
),
(
    'Employer Sponsorship Made Easier: New 482 Requirements',
    'employer-sponsorship-easier-482-requirements',
    E'The Temporary Skill Shortage (TSS) visa (subclass 482) has undergone significant changes to make employer sponsorship more accessible.\n\nKey improvements:\n- Reduced work experience requirement from 3 to 2 years\n- Removal of occupation ceiling limits\n- Streamlined labour market testing\n- Pathway to permanent residency after 2 years (reduced from 3)\n\nThese changes make Australia more competitive in attracting global talent.',
    'Reduced requirements and faster pathway to permanent residency',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef007',
    '2025-02-01 08:45:00',
    true,
    4123
),
(
    'Citizenship Processing Accelerates: New Digital Platform',
    'citizenship-processing-digital-platform',
    E'The Department of Home Affairs has launched a new digital platform for Australian citizenship applications, significantly reducing processing times.\n\nThe platform features:\n- Online application tracking\n- Digital document submission\n- Automated eligibility checking\n- Integration with myGov\n\nCurrent processing times have improved from 12-18 months to 6-12 months for most applicants.',
    'Digital transformation reduces citizenship processing to 6-12 months',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef008',
    '2024-11-30 15:00:00',
    true,
    1567
),
(
    'Biometric Collection Expands to More Visa Types',
    'biometric-collection-expands',
    E'Biometric collection (fingerprints and facial image) is now required for most visa applicants from high-risk countries.\n\nThe expansion covers:\n- Visitor visas\n- Student visas\n- Working holiday visas\n- Some temporary work visas\n\nBiometrics must be provided at an Australian Visa Application Centre (AVAC) or Biometrics Collection Centre.',
    'Enhanced security measures through expanded biometric collection',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef009',
    '2024-12-10 11:30:00',
    true,
    987
);

-- ============================================================================
-- 004: FORUM TOPICS (Realistic discussion topics)
-- ============================================================================

INSERT INTO forum_topics (
    category_id,
    author_id,
    title,
    slug,
    content,
    is_pinned,
    view_count,
    replies_count
)
SELECT 
    fc.id,
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef00' || (random() * 9 + 1)::int,
    topic_data.title,
    topic_data.slug,
    topic_data.content,
    topic_data.is_pinned,
    (random() * 500 + 50)::int,
    (random() * 20 + 1)::int
FROM forum_categories fc
CROSS JOIN LATERAL (
    VALUES 
    ('How long does 189 visa take in 2025?', '189-visa-processing-time-2025', E'Hi everyone,\n\nI submitted my 189 visa application in October 2024 and still waiting. My occupation is Software Engineer (261313).\n\nMy timeline:\n- Submitted: 15 Oct 2024\n- Status: Received\n- CO contact: None yet\n\nAnyone with similar recent experience? How long are we looking at?\n\nThanks!', false),
    ('Partner visa - Do we need a migration agent?', 'partner-visa-migration-agent', E'Hello,\n\nMy partner and I are planning to apply for the 820/801 visa. We''re wondering if we should use a migration agent or do it ourselves.\n\nOur situation:\n- Together for 3 years\n- Living together for 2 years\n- Plenty of evidence (joint lease, bank accounts, photos)\n\nIs it worth the $3,000+ for an agent?\n\nWould love to hear experiences!', false),
    ('Job offer rescinded after 482 lodged - What now?', '482-job-offer-rescinded', E'Hi all,\n\nI''m in a stressful situation. My employer sponsored me for a 482 visa which was lodged 2 months ago. Yesterday they told me they''re rescinding the offer due to company restructuring.\n\nMy visa application is still processing.\n\nQuestions:\n1. Can I find another sponsor?\n2. How long do I have?\n3. What happens to my application?\n\nAny advice appreciated!', false),
    ('Student to PR pathway - Best options?', 'student-to-pr-pathway', E'Hey everyone,\n\nI''m currently on a 500 student visa finishing my Master of IT in June 2025.\n\nI want to stay in Australia permanently. What are my best options?\n\nMy profile:\n- Age: 26\n- Degree: Master of IT\n- English: IELTS 7.5 overall\n- No work experience yet\n\nShould I aim for:\n- 485 then points-tested visa?\n- Employer sponsorship?\n- State nomination?\n\nThanks for any guidance!', false),
    ('Biometrics appointment - How long to book?', 'biometrics-appointment-wait', E'Hi,\n\nI got a request for biometrics after submitting my visitor visa.\n\nHow far in advance do appointments book out? I''m in Sydney and the VFS website shows no availability for 3 weeks.\n\nIs this normal? Should I keep checking or is there another way?\n\nWorried about processing delays!', false)
) AS topic_data(title, slug, content, is_pinned)
WHERE fc.slug IN ('general', 'work-visas', 'family-visas', 'student-visas')
LIMIT 15;

-- ============================================================================
-- 005: SYSTEM SETTINGS
-- ============================================================================

INSERT INTO system_settings (key, value, description, is_public) VALUES
('platform_name', 'VisaBuild', 'Platform brand name', true),
('platform_url', 'https://yourvisasite.vercel.app', 'Production URL', true),
('support_email', 'support@visabuild.com', 'Customer support email', true),
('default_timezone', 'Australia/Sydney', 'Default timezone for dates', true),
('maintenance_mode', 'false', 'Emergency maintenance toggle', false),
('signup_enabled', 'true', 'Allow new user registrations', true),
('lawyer_applications_open', 'true', 'Accept new lawyer applications', true),
('tracker_verification_required', 'false', 'Require verification for tracker entries', false),
('forum_moderation', 'post_moderation', 'Forum moderation mode', false),
('max_file_upload_size_mb', '10', 'Maximum file upload size', true),
('supported_languages', '["en", "zh", "hi", "vi"]', 'Supported UI languages', true),
('google_analytics_id', '', 'GA tracking ID', false),
('stripe_publishable_key', '', 'Stripe public key', false),
('email_from_name', 'VisaBuild Team', 'Sender name for emails', true),
('email_from_address', 'noreply@visabuild.com', 'Sender email address', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================================
-- 006: ANALYTICS EVENTS (Sample data for dashboard)
-- ============================================================================

INSERT INTO analytics_events (
    event_name,
    user_id,
    properties,
    page_url,
    device_type,
    browser,
    country
)
SELECT 
    CASE (random() * 8)::int
        WHEN 0 THEN 'page_view'
        WHEN 1 THEN 'visa_search'
        WHEN 2 THEN 'login'
        WHEN 3 THEN 'signup'
        WHEN 4 THEN 'document_upload'
        WHEN 5 THEN 'booking_created'
        WHEN 6 THEN 'forum_post'
        ELSE 'profile_update'
    END,
    gen_random_uuid(),
    jsonb_build_object(
        'timestamp', NOW() - (random() * 30 || ' days')::interval,
        'session_duration', (random() * 1800)::int
    ),
    'https://yourvisasite.vercel.app/visas',
    CASE (random() * 3)::int
        WHEN 0 THEN 'desktop'
        WHEN 1 THEN 'mobile'
        ELSE 'tablet'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Chrome'
        WHEN 1 THEN 'Safari'
        WHEN 2 THEN 'Firefox'
        ELSE 'Edge'
    END,
    CASE (random() * 5)::int
        WHEN 0 THEN 'Australia'
        WHEN 1 THEN 'India'
        WHEN 2 THEN 'China'
        WHEN 3 THEN 'United Kingdom'
        ELSE 'United States'
    END
FROM generate_series(1, 500);

-- ============================================================================
-- 007: NOTIFICATIONS (Sample notifications)
-- ============================================================================

INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    action_url,
    is_read
)
SELECT 
    gen_random_uuid(),
    'in_app',
    CASE (random() * 5)::int
        WHEN 0 THEN 'New consultation booked'
        WHEN 1 THEN 'Document uploaded successfully'
        WHEN 2 THEN 'Visa application status updated'
        WHEN 3 THEN 'New forum reply'
        ELSE 'Welcome to VisaBuild'
    END,
    'This is a sample notification message for testing purposes.',
    '/dashboard',
    random() > 0.5
FROM generate_series(1, 100);

-- ============================================================================
-- SEED DATA COMPLETE
-- ============================================================================

-- Verify counts
SELECT 'Lawyer Profiles' as table_name, count(*) as count FROM lawyer_profiles
UNION ALL SELECT 'Tracker Entries', count(*) FROM tracker_entries
UNION ALL SELECT 'News Articles', count(*) FROM news_articles
UNION ALL SELECT 'Forum Topics', count(*) FROM forum_topics
UNION ALL SELECT 'Analytics Events', count(*) FROM analytics_events
UNION ALL SELECT 'Notifications', count(*) FROM notifications
UNION ALL SELECT 'System Settings', count(*) FROM system_settings;
