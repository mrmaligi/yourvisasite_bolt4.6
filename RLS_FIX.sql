-- ============================================
-- RLS FIX - DROP ALL EXISTING POLICIES FIRST
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. ENABLE RLS ON ALL TABLES (safe to run multiple times)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.saved_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.consultation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lawyer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_visa_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.youtube_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tracker_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.promo_codes ENABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING POLICIES (to avoid conflicts)
DROP POLICY IF EXISTS "Visas are viewable by everyone" ON public.visas;
DROP POLICY IF EXISTS "Document categories are viewable by everyone" ON public.document_categories;
DROP POLICY IF EXISTS "Marketplace categories are viewable by everyone" ON public.marketplace_categories;
DROP POLICY IF EXISTS "Forum categories are viewable by everyone" ON public.forum_categories;
DROP POLICY IF EXISTS "Published news articles are viewable by everyone" ON public.news_articles;
DROP POLICY IF EXISTS "YouTube feeds are viewable by everyone" ON public.youtube_feeds;
DROP POLICY IF EXISTS "Platform settings are viewable by everyone" ON public.platform_settings;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Saved visas policies
DROP POLICY IF EXISTS "Users can view own saved visas" ON public.saved_visas;
DROP POLICY IF EXISTS "Users can insert own saved visas" ON public.saved_visas;
DROP POLICY IF EXISTS "Users can delete own saved visas" ON public.saved_visas;
DROP POLICY IF EXISTS "Users can manage own saved visas" ON public.saved_visas;

-- Bookings policies
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Bookings viewable by participants" ON public.bookings;

-- Tracker entries policies
DROP POLICY IF EXISTS "Tracker entries are viewable by everyone" ON public.tracker_entries;
DROP POLICY IF EXISTS "Authenticated users can create tracker entries" ON public.tracker_entries;

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

-- User documents policies
DROP POLICY IF EXISTS "Users can view own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.user_documents;

-- Notification preferences policies
DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON public.notification_preferences;

-- Stripe customers policies
DROP POLICY IF EXISTS "Users can view own stripe customer" ON public.stripe_customers;

-- Messages policies
DROP POLICY IF EXISTS "Users can view messages for their bookings" ON public.messages;

-- Lawyer profiles policies
DROP POLICY IF EXISTS "Lawyer profiles are viewable by everyone" ON public.lawyer_profiles;
DROP POLICY IF EXISTS "Lawyers can update own profile" ON public.lawyer_profiles;

-- Consultation slots policies
DROP POLICY IF EXISTS "Users can view available consultation slots" ON public.consultation_slots;
DROP POLICY IF EXISTS "Lawyers can manage own consultation slots" ON public.consultation_slots;

-- Lawyer reviews policies
DROP POLICY IF EXISTS "Lawyer reviews are viewable by everyone" ON public.lawyer_reviews;
DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON public.lawyer_reviews;

-- Marketplace listings policies
DROP POLICY IF EXISTS "Active marketplace listings are viewable by everyone" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Lawyers can manage own listings" ON public.marketplace_listings;

-- Marketplace purchases policies
DROP POLICY IF EXISTS "Users can view own purchases" ON public.marketplace_purchases;

-- Marketplace reviews policies
DROP POLICY IF EXISTS "Marketplace reviews are viewable by everyone" ON public.marketplace_reviews;
DROP POLICY IF EXISTS "Users can create marketplace reviews" ON public.marketplace_reviews;

-- Forum topics policies
DROP POLICY IF EXISTS "Forum topics are viewable by everyone" ON public.forum_topics;
DROP POLICY IF EXISTS "Authenticated users can create topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Users can update own topics" ON public.forum_topics;

-- Forum replies policies
DROP POLICY IF EXISTS "Forum replies are viewable by everyone" ON public.forum_replies;
DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Users can update own replies" ON public.forum_replies;

-- Referrals policies
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;

-- User visa purchases policies
DROP POLICY IF EXISTS "Users can view own visa purchases" ON public.user_visa_purchases;

-- Document shares policies
DROP POLICY IF EXISTS "Users can view own document shares" ON public.document_shares;

-- ============================================
-- 3. CREATE ALL POLICIES FRESH
-- ============================================

-- PUBLIC TABLES (read-only)
CREATE POLICY "Visas are viewable by everyone" ON public.visas FOR SELECT USING (true);
CREATE POLICY "Document categories are viewable by everyone" ON public.document_categories FOR SELECT USING (true);
CREATE POLICY "Marketplace categories are viewable by everyone" ON public.marketplace_categories FOR SELECT USING (true);
CREATE POLICY "Forum categories are viewable by everyone" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Published news articles are viewable by everyone" ON public.news_articles FOR SELECT USING (is_published = true);
CREATE POLICY "YouTube feeds are viewable by everyone" ON public.youtube_feeds FOR SELECT USING (true);
CREATE POLICY "Platform settings are viewable by everyone" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);

-- PROFILES (public view, own edit)
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- SAVED VISAS (own only)
CREATE POLICY "Users can view own saved visas" ON public.saved_visas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved visas" ON public.saved_visas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved visas" ON public.saved_visas FOR DELETE USING (auth.uid() = user_id);

-- BOOKINGS (own only)
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- TRACKER ENTRIES (public view, auth create)
CREATE POLICY "Tracker entries are viewable by everyone" ON public.tracker_entries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tracker entries" ON public.tracker_entries FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- NOTIFICATIONS (own only)
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- USER DOCUMENTS (own only)
CREATE POLICY "Users can view own documents" ON public.user_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.user_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.user_documents FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATION PREFERENCES (own only)
CREATE POLICY "Users can view own notification preferences" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notification preferences" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notification preferences" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STRIPE CUSTOMERS (own only)
CREATE POLICY "Users can view own stripe customer" ON public.stripe_customers FOR SELECT USING (auth.uid() = user_id);

-- MESSAGES (booking participants)
CREATE POLICY "Users can view messages for their bookings" ON public.messages FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM public.bookings WHERE id = messages.booking_id
    UNION
    SELECT lp.user_id FROM public.bookings b 
    JOIN public.lawyer_profiles lp ON lp.id = b.lawyer_id 
    WHERE b.id = messages.booking_id
  )
);

-- LAWYER PROFILES (public view, own edit)
CREATE POLICY "Lawyer profiles are viewable by everyone" ON public.lawyer_profiles FOR SELECT USING (true);
CREATE POLICY "Lawyers can update own profile" ON public.lawyer_profiles FOR UPDATE USING (auth.uid() = user_id);

-- CONSULTATION SLOTS (public view available, own manage)
CREATE POLICY "Users can view available consultation slots" ON public.consultation_slots FOR SELECT USING (is_booked = false OR is_reserved = false);
CREATE POLICY "Lawyers can manage own consultation slots" ON public.consultation_slots FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM public.lawyer_profiles WHERE id = consultation_slots.lawyer_id)
);

-- LAWYER REVIEWS (public view)
CREATE POLICY "Lawyer reviews are viewable by everyone" ON public.lawyer_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON public.lawyer_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- MARKETPLACE LISTINGS (public view active, own manage)
CREATE POLICY "Active marketplace listings are viewable by everyone" ON public.marketplace_listings FOR SELECT USING (is_active = true);
CREATE POLICY "Lawyers can manage own listings" ON public.marketplace_listings FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM public.lawyer_profiles WHERE id = marketplace_listings.lawyer_id)
);

-- MARKETPLACE PURCHASES (own only)
CREATE POLICY "Users can view own purchases" ON public.marketplace_purchases FOR SELECT USING (auth.uid() = user_id);

-- MARKETPLACE REVIEWS (public view)
CREATE POLICY "Marketplace reviews are viewable by everyone" ON public.marketplace_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create marketplace reviews" ON public.marketplace_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FORUM TOPICS (public view, auth create)
CREATE POLICY "Forum topics are viewable by everyone" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create topics" ON public.forum_topics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own topics" ON public.forum_topics FOR UPDATE USING (auth.uid() = author_id);

-- FORUM REPLIES (public view, auth create)
CREATE POLICY "Forum replies are viewable by everyone" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id);

-- REFERRALS (own only)
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (
  auth.uid() = referrer_id OR auth.email() = referred_email
);

-- USER VISA PURCHASES (own only)
CREATE POLICY "Users can view own visa purchases" ON public.user_visa_purchases FOR SELECT USING (auth.uid() = user_id);

-- DOCUMENT SHARES (participants only)
CREATE POLICY "Users can view own document shares" ON public.document_shares FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.user_documents WHERE id = document_shares.document_id)
  OR
  auth.uid() IN (SELECT user_id FROM public.lawyer_profiles WHERE id = document_shares.lawyer_id)
);

SELECT 'RLS policies created successfully' as status;
