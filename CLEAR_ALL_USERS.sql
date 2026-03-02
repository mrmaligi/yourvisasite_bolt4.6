-- ============================================
-- CLEAR ALL USERS AND RELATED DATA
-- WARNING: This will delete ALL user data!
-- ============================================

-- Delete data in order (respecting foreign keys)

-- 1. Delete child tables first
DELETE FROM public.saved_visas;
DELETE FROM public.bookings;
DELETE FROM public.tracker_entries;
DELETE FROM public.notifications;
DELETE FROM public.user_documents;
DELETE FROM public.notification_preferences;
DELETE FROM public.stripe_customers;
DELETE FROM public.messages;
DELETE FROM public.consultation_slots;
DELETE FROM public.lawyer_reviews;
DELETE FROM public.marketplace_listings;
DELETE FROM public.marketplace_purchases;
DELETE FROM public.marketplace_reviews;
DELETE FROM public.forum_topics;
DELETE FROM public.forum_replies;
DELETE FROM public.referrals;
DELETE FROM public.user_visa_purchases;
DELETE FROM public.document_shares;
DELETE FROM public.contact_submissions;

-- 2. Delete lawyer profiles
DELETE FROM public.lawyer_profiles;

-- 3. Delete main profiles
DELETE FROM public.profiles;

-- 4. Delete auth users (this will cascade to profiles if FK exists)
-- Note: You may need to do this via Supabase Auth UI or API
DELETE FROM auth.users;

-- 5. Reset sequences if needed
-- ALTER SEQUENCE IF EXISTS public.profiles_id_seq RESTART WITH 1;

SELECT 'All users and related data deleted' as status;
