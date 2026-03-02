-- ============================================
-- FIND AND DELETE EXISTING USER
-- ============================================

-- 1. Find all users with this email
SELECT id, email, created_at, last_sign_in_at 
FROM auth.users 
WHERE email = 'manikaran2007@gmail.com';

-- 2. Find any profiles linked
SELECT p.id, p.role, p.full_name, u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'manikaran2007@gmail.com';

-- 3. Delete everything related to this user
-- Run these one by one:

-- First delete from profiles
DELETE FROM public.profiles 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'manikaran2007@gmail.com');

-- Then delete from auth.users (this should work now)
DELETE FROM auth.users 
WHERE email = 'manikaran2007@gmail.com';

-- Verify deletion
SELECT COUNT(*) as remaining FROM auth.users WHERE email = 'manikaran2007@gmail.com';
