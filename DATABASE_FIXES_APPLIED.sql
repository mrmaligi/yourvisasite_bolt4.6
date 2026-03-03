-- ============================================
-- DATABASE FIXES EXECUTED
-- Date: 2026-03-03
-- ============================================

-- 1. LAWYER PROFILES FIX
-- Created 10 lawyer_profiles for users with role='lawyer'
INSERT INTO lawyer_profiles (
    user_id, bar_number, jurisdiction, years_experience, is_verified, 
    verification_status, bio, practice_areas, hourly_rate_cents, 
    consultation_fee_cents, is_available, specializations, created_at, updated_at
)
SELECT 
    p.id,
    'AU-' || upper(substring(p.id::text, 1, 6)),
    'New South Wales',
    5,
    true,
    'approved',
    'Experienced migration agent.',
    ARRAY['Skilled Migration', 'Partner Visas'],
    25000,
    5000,
    true,
    ARRAY['Skilled Migration', 'Partner Visas'],
    NOW(),
    NOW()
FROM profiles p
LEFT JOIN lawyer_profiles lp ON p.id = lp.user_id
WHERE p.role = 'lawyer'
AND lp.user_id IS NULL;

-- 2. MAKE mrmaligi@outlook.com ADMIN
-- Check if profile exists, create if not
INSERT INTO profiles (id, role, full_name, is_verified, verification_status, is_active, created_at, updated_at)
SELECT 
    u.id, 'admin', 'Mk Admin', true, 'approved', true, NOW(), NOW()
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'mrmaligi@outlook.com'
AND p.id IS NULL;

-- Update to admin if profile exists
UPDATE profiles 
SET role = 'admin', is_verified = true, verification_status = 'approved', is_active = true
WHERE id IN (SELECT id FROM auth.users WHERE email = 'mrmaligi@outlook.com');

-- 3. CREATE TEST USERS
-- Admin
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, is_sso_user, is_anonymous, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'admin@visabuild.com', crypt('Admin123!', gen_salt('bf')), NOW(), false, false, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@visabuild.com');

INSERT INTO profiles (id, role, full_name, is_verified, verification_status, is_active, created_at, updated_at)
SELECT u.id, 'admin', 'Admin User', true, 'approved', true, NOW(), NOW()
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'admin@visabuild.com' AND p.id IS NULL;

-- Lawyer
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, is_sso_user, is_anonymous, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'lawyer@visabuild.com', crypt('Lawyer123!', gen_salt('bf')), NOW(), false, false, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lawyer@visabuild.com');

INSERT INTO profiles (id, role, full_name, is_verified, verification_status, is_active, created_at, updated_at)
SELECT u.id, 'lawyer', 'Test Lawyer', true, 'approved', true, NOW(), NOW()
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'lawyer@visabuild.com' AND p.id IS NULL;

INSERT INTO lawyer_profiles (user_id, bar_number, jurisdiction, is_verified, verification_status, is_available, hourly_rate_cents, consultation_fee_cents, created_at, updated_at)
SELECT p.id, 'AU-TEST01', 'New South Wales', true, 'approved', true, 25000, 5000, NOW(), NOW()
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'lawyer@visabuild.com'
AND NOT EXISTS (SELECT 1 FROM lawyer_profiles WHERE user_id = p.id);

-- User
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, is_sso_user, is_anonymous, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'user@visabuild.com', crypt('User123!', gen_salt('bf')), NOW(), false, false, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@visabuild.com');

INSERT INTO profiles (id, role, full_name, is_verified, verification_status, is_active, created_at, updated_at)
SELECT u.id, 'user', 'Test User', true, 'approved', true, NOW(), NOW()
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'user@visabuild.com' AND p.id IS NULL;

-- Verification
SELECT 'Fixes applied successfully' as status;
SELECT COUNT(*) as lawyer_profiles FROM lawyer_profiles;
SELECT email, role, is_verified FROM profiles p JOIN auth.users u ON u.id = p.id 
WHERE u.email IN ('mrmaligi@outlook.com', 'admin@visabuild.com', 'lawyer@visabuild.com', 'user@visabuild.com');
