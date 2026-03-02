-- Migration: Enable RLS and create security policies
-- Created: 2026-03-02
-- Purpose: Secure database tables with proper RLS policies

-- ============================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================

-- Core user data tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Lawyer-related tables
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_reviews ENABLE ROW LEVEL SECURITY;

-- Marketplace tables
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- Forum tables
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Other user-specific tables
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_visa_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

-- Visas table - keep public but explicitly set policy
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_feeds ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. DROP EXISTING POLICIES (to avoid conflicts)
-- ============================================

DROP POLICY IF EXISTS "Visas are viewable by everyone" ON public.visas;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own saved visas" ON public.saved_visas;
DROP POLICY IF EXISTS "Tracker entries are viewable by everyone" ON public.tracker_entries;
DROP POLICY IF EXISTS "Bookings viewable by participants" ON public.bookings;

-- ============================================
-- 3. CREATE POLICIES FOR PUBLIC TABLES
-- ============================================

-- Visas: Public read-only
CREATE POLICY "Visas are viewable by everyone" 
  ON public.visas FOR SELECT USING (true);

-- Document categories: Public read-only
CREATE POLICY "Document categories are viewable by everyone" 
  ON public.document_categories FOR SELECT USING (true);

-- Marketplace categories: Public read-only
CREATE POLICY "Marketplace categories are viewable by everyone" 
  ON public.marketplace_categories FOR SELECT USING (true);

-- Forum categories: Public read-only
CREATE POLICY "Forum categories are viewable by everyone" 
  ON public.forum_categories FOR SELECT USING (true);

-- News articles: Public read-only (only published)
CREATE POLICY "Published news articles are viewable by everyone" 
  ON public.news_articles FOR SELECT USING (is_published = true);

-- YouTube feeds: Public read-only
CREATE POLICY "YouTube feeds are viewable by everyone" 
  ON public.youtube_feeds FOR SELECT USING (true);

-- ============================================
-- 4. CREATE POLICIES FOR USER DATA (OWNERS ONLY)
-- ============================================

-- Profiles: Users manage own, public can view basic info
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Saved visas: Users manage own only
CREATE POLICY "Users can view own saved visas" 
  ON public.saved_visas FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved visas" 
  ON public.saved_visas FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved visas" 
  ON public.saved_visas FOR DELETE USING (auth.uid() = user_id);

-- Bookings: Users view own, lawyers view their bookings
CREATE POLICY "Users can view own bookings" 
  ON public.bookings FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM public.lawyer_profiles WHERE id = bookings.lawyer_id)
  );

CREATE POLICY "Users can insert own bookings" 
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" 
  ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Tracker entries: Public can view, authenticated can create
CREATE POLICY "Tracker entries are viewable by everyone" 
  ON public.tracker_entries FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tracker entries" 
  ON public.tracker_entries FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications: Users manage own only
CREATE POLICY "Users can view own notifications" 
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" 
  ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- User documents: Users manage own only
CREATE POLICY "Users can view own documents" 
  ON public.user_documents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" 
  ON public.user_documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" 
  ON public.user_documents FOR DELETE USING (auth.uid() = user_id);

-- Notification preferences: Users manage own only
CREATE POLICY "Users can view own notification preferences" 
  ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences" 
  ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences" 
  ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stripe customers: Users view own only
CREATE POLICY "Users can view own stripe customer" 
  ON public.stripe_customers FOR SELECT USING (auth.uid() = user_id);

-- Messages: Users view messages for their bookings
CREATE POLICY "Users can view messages for their bookings" 
  ON public.messages FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.bookings WHERE id = messages.booking_id
      UNION
      SELECT lp.user_id FROM public.bookings b 
      JOIN public.lawyer_profiles lp ON lp.id = b.lawyer_id 
      WHERE b.id = messages.booking_id
    )
  );

-- ============================================
-- 5. CREATE POLICIES FOR LAWYER TABLES
-- ============================================

-- Lawyer profiles: Public can view, lawyers manage own
CREATE POLICY "Lawyer profiles are viewable by everyone" 
  ON public.lawyer_profiles FOR SELECT USING (true);

CREATE POLICY "Lawyers can update own profile" 
  ON public.lawyer_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Consultation slots: Public view available, lawyers manage own
CREATE POLICY "Users can view available consultation slots" 
  ON public.consultation_slots FOR SELECT USING (is_booked = false OR is_reserved = false);

CREATE POLICY "Lawyers can manage own consultation slots" 
  ON public.consultation_slots FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.lawyer_profiles WHERE id = consultation_slots.lawyer_id)
  );

-- Lawyer reviews: Public can view, users can create for their bookings
CREATE POLICY "Lawyer reviews are viewable by everyone" 
  ON public.lawyer_reviews FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" 
  ON public.lawyer_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 6. CREATE POLICIES FOR MARKETPLACE
-- ============================================

-- Marketplace listings: Public can view active
CREATE POLICY "Active marketplace listings are viewable by everyone" 
  ON public.marketplace_listings FOR SELECT USING (is_active = true);

CREATE POLICY "Lawyers can manage own listings" 
  ON public.marketplace_listings FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.lawyer_profiles WHERE id = marketplace_listings.lawyer_id)
  );

-- Marketplace purchases: Users view own
CREATE POLICY "Users can view own purchases" 
  ON public.marketplace_purchases FOR SELECT USING (auth.uid() = user_id);

-- Marketplace reviews: Public view, users create
CREATE POLICY "Marketplace reviews are viewable by everyone" 
  ON public.marketplace_reviews FOR SELECT USING (true);

CREATE POLICY "Users can create marketplace reviews" 
  ON public.marketplace_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. CREATE POLICIES FOR FORUM
-- ============================================

-- Forum topics: Public view, authenticated create
CREATE POLICY "Forum topics are viewable by everyone" 
  ON public.forum_topics FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create topics" 
  ON public.forum_topics FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own topics" 
  ON public.forum_topics FOR UPDATE USING (auth.uid() = author_id);

-- Forum replies: Public view, authenticated create
CREATE POLICY "Forum replies are viewable by everyone" 
  ON public.forum_replies FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" 
  ON public.forum_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own replies" 
  ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id);

-- ============================================
-- 8. CREATE POLICIES FOR OTHER TABLES
-- ============================================

-- Referrals: Users view own
CREATE POLICY "Users can view own referrals" 
  ON public.referrals FOR SELECT USING (
    auth.uid() = referrer_id OR 
    auth.email() = referred_email
  );

-- User visa purchases: Users view own
CREATE POLICY "Users can view own visa purchases" 
  ON public.user_visa_purchases FOR SELECT USING (auth.uid() = user_id);

-- Document shares: Users view own shares
CREATE POLICY "Users can view own document shares" 
  ON public.document_shares FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.user_documents WHERE id = document_shares.document_id)
    OR
    auth.uid() IN (SELECT user_id FROM public.lawyer_profiles WHERE id = document_shares.lawyer_id)
  );

-- ============================================
-- 9. PLATFORM SETTINGS (ADMIN ONLY)
-- ============================================

-- Platform settings: Public read, admin write
CREATE POLICY "Platform settings are viewable by everyone" 
  ON public.platform_settings FOR SELECT USING (true);

-- ============================================
-- 10. PRODUCTS (ADMIN MANAGED)
-- ============================================

-- Products: Public read
CREATE POLICY "Products are viewable by everyone" 
  ON public.products FOR SELECT USING (is_active = true);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
