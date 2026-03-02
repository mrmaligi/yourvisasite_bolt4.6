-- ============================================================================
-- VISABUILD FULL DATABASE RESET AND REBUILD
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/usiorucxradthxhetqaq/sql/new
-- ============================================================================

-- STEP 1: FACTORY RESET (Drop Everything)
-- =======================================

-- Drop triggers
DO $$
DECLARE trig RECORD;
BEGIN
    FOR trig IN SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public'
    LOOP EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', trig.trigger_name, trig.event_object_table); END LOOP;
END $$;

-- Drop functions
DO $$
DECLARE func RECORD;
BEGIN
    FOR func IN SELECT routine_name, routine_schema FROM information_schema.routines WHERE routine_type = 'FUNCTION' AND routine_schema IN ('public', 'lawyer', 'stripe')
    LOOP EXECUTE format('DROP FUNCTION IF EXISTS %I.%I CASCADE', func.routine_schema, func.routine_name); END LOOP;
END $$;

-- Drop policies
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname IN ('public', 'lawyer', 'stripe')
    LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename); END LOOP;
END $$;

-- Drop tables
DROP TABLE IF EXISTS email_notifications, notification_preferences, contact_submissions, success_stories, quiz_results, referrals, forum_subscriptions, forum_reply_votes, forum_topic_votes, forum_replies, forum_topics, forum_categories, template_reviews, user_template_purchases, document_templates, user_visas, saved_visas, marketplace_reviews, marketplace_purchases, marketplace_listings, marketplace_categories, consultation_slots, bookings, tracker_entries, news_comments, news_articles, youtube_feeds, premium_content, document_examples, document_categories, user_documents, lawyer_reviews, lawyer_profiles, activity_logs, promo_codes, platform_settings, processing_time_history, visa_processing_fees, visas, profiles CASCADE;

-- Drop schemas
DROP SCHEMA IF EXISTS lawyer, stripe CASCADE;

-- Drop types
DROP TYPE IF EXISTS user_role, visa_category, tracker_outcome, booking_status, payment_status, document_status, verification_status CASCADE;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS lawyer;
CREATE SCHEMA IF NOT EXISTS stripe;

-- STEP 2: CREATE CORE TABLES
-- ==========================

-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'lawyer', 'admin')),
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    referral_code TEXT UNIQUE,
    referral_balance INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visas table
CREATE TABLE visas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subclass TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Australia',
    category TEXT,
    official_link TEXT,
    summary TEXT,
    description TEXT,
    base_cost_aud INTEGER,
    cost_aud TEXT,
    processing_time_range TEXT,
    duration TEXT,
    key_requirements TEXT,
    processing_fee_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visa processing fees
CREATE TABLE visa_processing_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visa_id UUID REFERENCES visas(id) ON DELETE CASCADE,
    fee_type TEXT NOT NULL,
    amount_aud INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document categories
CREATE TABLE document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    tips TEXT,
    icon TEXT DEFAULT 'FileText',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    explanation TEXT,
    examples TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User documents
CREATE TABLE user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    document_category_id UUID REFERENCES document_categories(id),
    visa_id UUID REFERENCES visas(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    notes TEXT
);

-- Premium content
CREATE TABLE premium_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visa_id UUID REFERENCES visas(id) ON DELETE CASCADE,
    section_number INTEGER NOT NULL,
    section_title TEXT NOT NULL,
    content TEXT NOT NULL,
    tips TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User visas (purchased)
CREATE TABLE user_visas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    visa_id UUID REFERENCES visas(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'refunded')),
    stripe_payment_intent_id TEXT,
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, visa_id)
);

-- Saved visas
CREATE TABLE saved_visas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    visa_id UUID REFERENCES visas(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, visa_id)
);

-- Lawyer profiles
CREATE TABLE lawyer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    bar_number TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    specializations TEXT[],
    years_experience INTEGER,
    bio TEXT,
    credentials_url TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    hourly_rate_cents INTEGER,
    consultation_fee_cents INTEGER,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultation slots
CREATE TABLE consultation_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    stripe_payment_intent_id TEXT,
    amount_paid_cents INTEGER,
    meeting_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracker entries
CREATE TABLE tracker_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    visa_id UUID REFERENCES visas(id) ON DELETE CASCADE,
    submitted_at DATE NOT NULL,
    decision_date DATE,
    processing_days INTEGER,
    outcome TEXT CHECK (outcome IN ('approved', 'refused', 'withdrawn', 'pending')),
    location TEXT,
    notes TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_method TEXT,
    weight INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News articles
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    summary TEXT,
    author_id UUID REFERENCES profiles(id),
    published_at TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News comments
CREATE TABLE news_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum system
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMPTZ,
    last_reply_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    upvotes INTEGER DEFAULT 0,
    parent_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_topic_votes (
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (topic_id, user_id)
);

CREATE TABLE forum_reply_votes (
    reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (reply_id, user_id)
);

CREATE TABLE forum_subscriptions (
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (topic_id, user_id)
);

-- Growth features
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    referral_code TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted')),
    reward_amount INTEGER DEFAULT 2000,
    reward_claimed BOOLEAN DEFAULT FALSE,
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    current_country TEXT,
    destination_country TEXT DEFAULT 'Australia',
    visa_purpose TEXT[],
    has_job_offer BOOLEAN,
    has_family_sponsor BOOLEAN,
    english_level TEXT,
    education_level TEXT,
    work_experience_years INTEGER,
    age_range TEXT,
    recommended_visas JSONB,
    eligibility_scores JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE success_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    visa_id UUID REFERENCES visas(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    story TEXT NOT NULL,
    timeline_days INTEGER,
    challenges TEXT,
    tips TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'spam')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Visas are viewable by everyone" ON visas FOR SELECT USING (is_active = true);

CREATE POLICY "User visas viewable by owner" ON user_visas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Saved visas viewable by owner" ON saved_visas FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Documents viewable by owner" ON user_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Documents insertable by owner" ON user_documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Lawyer profiles are viewable" ON lawyer_profiles FOR SELECT USING (verification_status = 'approved');

CREATE POLICY "Bookings viewable by participants" ON bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM lawyer_profiles WHERE id = lawyer_id));

CREATE POLICY "Tracker entries are public" ON tracker_entries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tracker entries" ON tracker_entries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Published news is public" ON news_articles FOR SELECT USING (is_published = true);
CREATE POLICY "News comments are public" ON news_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON news_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Forum categories are public" ON forum_categories FOR SELECT USING (true);
CREATE POLICY "Forum topics are public" ON forum_topics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create topics" ON forum_topics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Forum replies are public" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can reply" ON forum_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Success stories are public" ON success_stories FOR SELECT USING (is_published = true);
CREATE POLICY "Contact submissions insertable by anyone" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Auto-generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT) FROM 1 FOR 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_referral_code ON profiles;
CREATE TRIGGER trigger_generate_referral_code
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- Update reply counts
CREATE OR REPLACE FUNCTION update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_topics SET replies_count = replies_count + 1, last_reply_at = NEW.created_at, last_reply_by = NEW.author_id WHERE id = NEW.topic_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_topics SET replies_count = replies_count - 1 WHERE id = OLD.topic_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_reply_count ON forum_replies;
CREATE TRIGGER trigger_update_reply_count
    AFTER INSERT OR DELETE ON forum_replies
    FOR EACH ROW
    EXECUTE FUNCTION update_topic_reply_count();

-- Insert default forum categories
INSERT INTO forum_categories (name, slug, description, icon, display_order) VALUES
('General Discussion', 'general', 'General questions about Australian immigration', 'MessageCircle', 1),
('Work Visas', 'work-visas', 'Employer-sponsored and skilled work visas', 'Briefcase', 2),
('Student Visas', 'student-visas', 'Questions about studying in Australia', 'GraduationCap', 3),
('Family Visas', 'family-visas', 'Partner visas, parent visas, family sponsorship', 'Users', 4),
('Visitor Visas', 'visitor-visas', 'Tourist visas, working holiday visas', 'Plane', 5),
('Permanent Residency', 'permanent-residency', 'PR pathways and citizenship', 'Home', 6),
('Document Help', 'document-help', 'Help with forms and requirements', 'FileText', 7),
('Processing Times', 'processing-times', 'Share and discuss processing times', 'Clock', 8),
('Success Stories', 'success-stories', 'Share your visa success story', 'Trophy', 9);

-- Insert sample visas
INSERT INTO visas (subclass, name, country, category, summary, processing_time_range) VALUES
('482', 'Temporary Skill Shortage visa', 'Australia', 'work', 'For skilled workers sponsored by an employer', '1-3 months'),
('189', 'Skilled Independent visa', 'Australia', 'work', 'Permanent visa for skilled workers not sponsored', '6-12 months'),
('190', 'Skilled Nominated visa', 'Australia', 'work', 'Permanent visa for skilled workers nominated by state', '6-12 months'),
('491', 'Skilled Work Regional visa', 'Australia', 'work', 'Provisional visa for skilled workers in regional areas', '6-12 months'),
('500', 'Student visa', 'Australia', 'student', 'For international students studying in Australia', '1-3 months'),
('485', 'Temporary Graduate visa', 'Australia', 'work', 'For recent graduates to work in Australia', '3-6 months'),
('820', 'Partner visa (Onshore)', 'Australia', 'family', 'For partners of Australian citizens/PR', '12-24 months'),
('600', 'Visitor visa', 'Australia', 'visitor', 'For tourism, business, or family visits', '20-30 days'),
('186', 'Employer Nomination Scheme', 'Australia', 'work', 'Permanent visa for employer-sponsored workers', '6-12 months');

-- Insert document categories
INSERT INTO document_categories (key, name, description, icon, display_order) VALUES
('identity', 'Identity Documents', 'Passport, birth certificate, national ID', 'User', 1),
('education', 'Educational Documents', 'Degrees, transcripts, certificates', 'GraduationCap', 2),
('employment', 'Employment Documents', 'Reference letters, contracts, payslips', 'Briefcase', 3),
('financial', 'Financial Documents', 'Bank statements, tax returns, payslips', 'DollarSign', 4),
('relationship', 'Relationship Documents', 'Marriage certificate, photos, joint accounts', 'Heart', 5),
('health', 'Health Documents', 'Medical exams, health insurance', 'Activity', 6),
('character', 'Character Documents', 'Police checks, statutory declarations', 'Shield', 7);

-- ============================================================================
-- RESET COMPLETE - Database is now fresh with core tables and sample data
-- ============================================================================
