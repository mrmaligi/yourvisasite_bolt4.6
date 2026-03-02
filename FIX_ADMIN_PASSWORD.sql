-- ============================================
-- VERIFY AND FIX ADMIN USER PASSWORD
-- ============================================

-- 1. Check if user exists
SELECT id, email, created_at, last_sign_in_at 
FROM auth.users 
WHERE email = 'manikaran2007@gmail.com';

-- 2. If user exists, update the password hash
-- Run this only if the above shows the user
UPDATE auth.users 
SET encrypted_password = crypt('Qwerty@2007', gen_salt('bf'))
WHERE email = 'manikaran2007@gmail.com';

-- 3. Also update the profile if needed
UPDATE public.profiles 
SET is_verified = true, 
    verification_status = 'approved',
    is_active = true
WHERE id = 'a1c1c904-6e7a-49ab-9a2d-02308632b1eb';

SELECT 'Password updated' as status;
