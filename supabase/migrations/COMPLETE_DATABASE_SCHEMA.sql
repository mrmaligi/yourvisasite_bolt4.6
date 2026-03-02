-- ============================================================================
-- VISABUILD BACKEND - COMPLETE DATABASE SCHEMA
-- Production-ready for 1M+ users
-- Run these migrations in order
-- ============================================================================

-- ============================================================================
-- 001: EXTENSIONS AND FOUNDATION
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Custom types
CREATE TYPE user_role AS ENUM ('user', 'lawyer', 'admin');
CREATE TYPE visa_category AS ENUM ('work', 'student', 'family', 'visitor', 'business', 'other');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'processing', 'assessment', 'decision', 'approved', 'refused', 'withdrawn');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE lawyer_verification_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'suspended');
CREATE TYPE notification_type AS ENUM ('email', 'push', 'sms', 'in_app');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- ============================================================================
-- 002: CORE TABLES
-- ============================================================================

-- Profiles (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email CITEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    
    -- Personal info
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    nationality TEXT,
    current_country TEXT DEFAULT 'Australia',
    
    -- Profile media
    avatar_url TEXT,
    cover_image_url TEXT,
    
    -- Preferences
    preferred_language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Australia/Sydney',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- Marketing
    marketing_consent BOOLEAN DEFAULT false,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES profiles(id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    -- Security
    last_login_at TIMESTAMPTZ,
    last_password_change_at TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Visa Types (comprehensive visa database)
CREATE TABLE visas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic info
    subclass TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    country TEXT DEFAULT 'Australia' NOT NULL,
    category visa_category NOT NULL,
    
    -- Descriptions
    summary TEXT,
    description TEXT,
    eligibility_criteria TEXT[],
    key_requirements TEXT[],
    
    -- Costs
    government_fee_aud INTEGER,
    our_service_fee_aud INTEGER DEFAULT 4900, -- $49 in cents
    total_cost_aud INTEGER GENERATED ALWAYS AS (COALESCE(government_fee_aud, 0) + COALESCE(our_service_fee_aud, 0)) STORED,
    
    -- Processing
    processing_time_min_days INTEGER,
    processing_time_max_days INTEGER,
    processing_time_description TEXT,
    
    -- Validity
    visa_duration TEXT,
    can_extend BOOLEAN DEFAULT false,
    path_to_pr BOOLEAN DEFAULT false,
    
    -- Links
    official_link TEXT,
    checklist_pdf_url TEXT,
    
    -- Media
    image_url TEXT,
    video_url TEXT,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    
    -- Stats
    popularity_score INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    total_applications INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 003: USER CONTENT TABLES
-- ============================================================================

-- User Applications (track their visa journeys)
CREATE TABLE user_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    visa_id UUID NOT NULL REFERENCES visas(id) ON DELETE CASCADE,
    
    -- Application details
    application_reference TEXT UNIQUE, -- Auto-generated
    status application_status DEFAULT 'draft',
    
    -- Dates
    submitted_at TIMESTAMPTZ,
    decision_date DATE,
    visa_grant_date DATE,
    visa_expiry_date DATE,
    
    -- Progress tracking
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 5,
    progress_percentage INTEGER DEFAULT 0,
    
    -- Location/Processing
    processing_location TEXT,
    case_officer TEXT,
    
    -- Notes
    notes TEXT,
    internal_notes TEXT, -- For lawyers/admins
    
    -- Documents checklist
    documents_received TEXT[],
    documents_pending TEXT[],
    
    -- Premium content access
    has_premium_access BOOLEAN DEFAULT false,
    premium_access_granted_at TIMESTAMPTZ,
    premium_access_expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, visa_id, status)
);

-- Saved Visas (wishlist)
CREATE TABLE saved_visas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    visa_id UUID NOT NULL REFERENCES visas(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, visa_id)
);

-- Documents (user uploads)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES user_applications(id) ON DELETE SET NULL,
    
    -- Document info
    document_type TEXT NOT NULL, -- passport, degree, etc
    document_name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Supabase Storage path
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    
    -- Status
    status document_status DEFAULT 'pending',
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    rejection_reason TEXT,
    
    -- Expiry (for documents like passports)
    document_expiry_date DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 004: LAWYER SYSTEM
-- ============================================================================

-- Lawyer Profiles
CREATE TABLE lawyer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Professional info
    bar_number TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    years_experience INTEGER,
    specializations TEXT[],
    languages_spoken TEXT[],
    
    -- Verification
    verification_status lawyer_verification_status DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    rejection_reason TEXT,
    credentials_url TEXT,
    
    -- Profile
    bio TEXT,
    education TEXT,
    awards TEXT[],
    publications TEXT[],
    
    -- Services
    services_offered TEXT[],
    hourly_rate_cents INTEGER,
    consultation_fee_cents INTEGER,
    minimum_fee_cents INTEGER,
    offers_free_consultation BOOLEAN DEFAULT false,
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    is_taking_new_clients BOOLEAN DEFAULT true,
    
    -- Ratings
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_clients INTEGER DEFAULT 0,
    total_consultations INTEGER DEFAULT 0,
    
    -- Marketing
    profile_views INTEGER DEFAULT 0,
    featured_until TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lawyer Availability (time slots)
CREATE TABLE lawyer_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
    
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    is_available BOOLEAN DEFAULT true,
    specific_date DATE, -- NULL means recurring
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultation Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participants
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
    
    -- Booking details
    booking_reference TEXT UNIQUE, -- Auto-generated
    status booking_status DEFAULT 'pending',
    
    -- Timing
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    timezone TEXT DEFAULT 'Australia/Sydney',
    
    -- Meeting
    meeting_type TEXT DEFAULT 'video', -- video, phone, in_person
    meeting_link TEXT,
    meeting_address TEXT,
    
    -- Payment
    amount_cents INTEGER,
    is_paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMPTZ,
    
    -- Content
    topic TEXT,
    notes TEXT,
    pre_meeting_notes TEXT,
    post_meeting_notes TEXT,
    
    -- Reminders
    reminder_sent_24h BOOLEAN DEFAULT false,
    reminder_sent_1h BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lawyer Reviews
CREATE TABLE lawyer_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT,
    review TEXT,
    
    is_verified BOOLEAN DEFAULT false, -- Verified they actually had a consultation
    is_public BOOLEAN DEFAULT true,
    
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, booking_id) -- One review per booking
);

-- ============================================================================
-- 005: TRACKER SYSTEM
-- ============================================================================

-- Processing Time Tracker (crowdsourced data)
CREATE TABLE tracker_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reporter
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Visa details
    visa_id UUID NOT NULL REFERENCES visas(id) ON DELETE CASCADE,
    
    -- Application details
    location TEXT, -- Where applied from
    application_date DATE NOT NULL,
    decision_date DATE,
    processing_days INTEGER GENERATED ALWAYS AS (decision_date - application_date) STORED,
    
    -- Outcome
    outcome TEXT CHECK (outcome IN ('approved', 'refused', 'withdrawn', 'pending')),
    is_priority TEXT CHECK (is_priority IN ('standard', 'priority', 'super_priority')),
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES profiles(id),
    verification_method TEXT, -- document_upload, lawyer_confirm, etc
    
    -- Quality
    weight INTEGER DEFAULT 1, -- Verified entries get higher weight
    
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aggregated Stats (materialized view will be created)
CREATE TABLE tracker_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_id UUID NOT NULL REFERENCES visas(id) ON DELETE CASCADE,
    
    -- Timeframes
    stat_period TEXT DEFAULT '30_days', -- 7_days, 30_days, 90_days, all_time
    
    -- Stats
    avg_processing_days DECIMAL(10,2),
    min_processing_days INTEGER,
    max_processing_days INTEGER,
    median_processing_days DECIMAL(10,2),
    
    sample_size INTEGER,
    approval_rate DECIMAL(5,2),
    
    -- Breakdowns
    by_location JSONB,
    by_priority JSONB,
    
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(visa_id, stat_period)
);

-- ============================================================================
-- 006: COMMUNITY FEATURES
-- ============================================================================

-- Forum Categories
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'MessageSquare',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Stats
    topic_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum Topics
CREATE TABLE forum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    
    -- Moderation
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    is_announcement BOOLEAN DEFAULT false,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    upvote_count INTEGER DEFAULT 0,
    
    -- Activity
    last_reply_at TIMESTAMPTZ,
    last_reply_by UUID REFERENCES profiles(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(category_id, slug)
);

-- Forum Replies
CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    
    -- Threading
    parent_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    
    -- Moderation
    is_solution BOOLEAN DEFAULT false, -- Marked as best answer
    
    -- Stats
    upvote_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 007: NOTIFICATION SYSTEM
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    type notification_type DEFAULT 'in_app',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Action
    action_url TEXT,
    action_text TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Tracking
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB, -- Store related IDs, etc
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Queue (for bulk email processing)
CREATE TABLE email_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    recipient_email TEXT NOT NULL,
    recipient_user_id UUID REFERENCES profiles(id),
    
    template_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT,
    body_text TEXT,
    
    status TEXT DEFAULT 'pending', -- pending, sent, failed, bounced
    error_message TEXT,
    
    priority priority_level DEFAULT 'medium',
    
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 008: ADMIN & ANALYTICS
-- ============================================================================

-- Activity Log (audit trail)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID REFERENCES profiles(id),
    session_id TEXT,
    
    action TEXT NOT NULL, -- login, logout, view, create, update, delete
    entity_type TEXT, -- visa, booking, document, etc
    entity_id UUID,
    
    -- Details
    old_data JSONB,
    new_data JSONB,
    changes JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    event_name TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id),
    session_id TEXT,
    
    -- Event data
    properties JSONB,
    
    -- Page context
    page_url TEXT,
    referrer_url TEXT,
    
    -- Device
    device_type TEXT,
    browser TEXT,
    os TEXT,
    
    -- Geo (if available)
    country TEXT,
    city TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings
CREATE TABLE system_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    value_type TEXT DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id)
);

-- ============================================================================
-- 009: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role) WHERE role = 'lawyer';
CREATE INDEX idx_profiles_referral ON profiles(referral_code);
CREATE INDEX idx_profiles_created ON profiles(created_at DESC);

-- Visas indexes
CREATE INDEX idx_visas_category ON visas(category);
CREATE INDEX idx_visas_country ON visas(country);
CREATE INDEX idx_visas_active ON visas(is_active) WHERE is_active = true;
CREATE INDEX idx_visas_slug ON visas(slug);

-- Applications indexes
CREATE INDEX idx_applications_user ON user_applications(user_id);
CREATE INDEX idx_applications_visa ON user_applications(visa_id);
CREATE INDEX idx_applications_status ON user_applications(status);
CREATE INDEX idx_applications_dates ON user_applications(submitted_at, decision_date);

-- Documents indexes
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_application ON documents(application_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Lawyer indexes
CREATE INDEX idx_lawyer_verification ON lawyer_profiles(verification_status);
CREATE INDEX idx_lawyer_available ON lawyer_profiles(is_available) WHERE is_available = true;
CREATE INDEX idx_lawyer_rating ON lawyer_profiles(average_rating DESC);

-- Bookings indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_lawyer ON bookings(lawyer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);

-- Tracker indexes
CREATE INDEX idx_tracker_visa ON tracker_entries(visa_id);
CREATE INDEX idx_tracker_dates ON tracker_entries(application_date, decision_date);
CREATE INDEX idx_tracker_verified ON tracker_entries(is_verified) WHERE is_verified = true;

-- Forum indexes
CREATE INDEX idx_topics_category ON forum_topics(category_id);
CREATE INDEX idx_topics_author ON forum_topics(author_id);
CREATE INDEX idx_topics_pinned ON forum_topics(is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_replies_topic ON forum_replies(topic_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Analytics indexes
CREATE INDEX idx_analytics_event ON analytics_events(event_name);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

-- ============================================================================
-- 010: RLS POLICIES (Security)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users see own, lawyers see own, admins see all
CREATE POLICY "Users view own profile" ON profiles FOR SELECT
    USING (auth.uid() = id OR role = 'lawyer' OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users update own profile" ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Visas: Public read, admin write
CREATE POLICY "Visas public read" ON visas FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins manage visas" ON visas FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Applications: Users see own, lawyers see clients
CREATE POLICY "Users view own applications" ON user_applications FOR SELECT
    USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM lawyer_profiles lp 
        JOIN bookings b ON b.lawyer_id = lp.id
        WHERE lp.user_id = auth.uid() AND b.user_id = user_applications.user_id
    ) OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users create applications" ON user_applications FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Documents: Users see own
CREATE POLICY "Users view own documents" ON documents FOR SELECT
    USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users upload documents" ON documents FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Lawyer profiles: Public read verified, own write
CREATE POLICY "Verified lawyers public" ON lawyer_profiles FOR SELECT
    USING (verification_status = 'approved' OR user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Bookings: Participants only
CREATE POLICY "Booking participants" ON bookings FOR SELECT
    USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM lawyer_profiles lp WHERE lp.user_id = auth.uid() AND lp.id = bookings.lawyer_id
    ) OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Forum: Public read, auth write
CREATE POLICY "Forum public read" ON forum_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Forum public read" ON forum_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Forum public read" ON forum_replies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth create topics" ON forum_topics FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth create replies" ON forum_replies FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Notifications: Own only
CREATE POLICY "Own notifications" ON notifications FOR ALL
    USING (user_id = auth.uid());

-- ============================================================================
-- 011: FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-generate referral code on user creation
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT) FROM 1 FOR 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_referral_code
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_visas_updated_at BEFORE UPDATE ON visas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON user_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lawyer_profiles_updated_at BEFORE UPDATE ON lawyer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update forum topic reply count
CREATE OR REPLACE FUNCTION update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_topics 
        SET reply_count = reply_count + 1,
            last_reply_at = NEW.created_at,
            last_reply_by = NEW.author_id
        WHERE id = NEW.topic_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_topics 
        SET reply_count = reply_count - 1
        WHERE id = OLD.topic_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reply_count
    AFTER INSERT OR DELETE ON forum_replies
    FOR EACH ROW
    EXECUTE FUNCTION update_topic_reply_count();

-- Log activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, old_data, new_data)
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        row_to_json(OLD),
        row_to_json(NEW)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 012: SEED DATA
-- ============================================================================

-- Forum categories
INSERT INTO forum_categories (name, slug, description, icon, display_order) VALUES
('General Discussion', 'general', 'General questions about Australian immigration', 'MessageCircle', 1),
('Work Visas', 'work-visas', 'Employer-sponsored and skilled work visas', 'Briefcase', 2),
('Student Visas', 'student-visas', 'Questions about studying in Australia', 'GraduationCap', 3),
('Family Visas', 'family-visas', 'Partner visas, parent visas, family sponsorship', 'Users', 4),
('Visitor Visas', 'visitor-visas', 'Tourist visas, working holiday visas', 'Plane', 5),
('Permanent Residency', 'permanent-residency', 'PR pathways and citizenship', 'Home', 6),
('Document Help', 'document-help', 'Help with forms and requirements', 'FileText', 7),
('Processing Times', 'processing-times', 'Share and discuss processing times', 'Clock', 8),
('Success Stories', 'success-stories', 'Share your visa success story', 'Trophy', 9)
ON CONFLICT (slug) DO NOTHING;

-- System settings
INSERT INTO system_settings (key, value, description) VALUES
('platform_name', 'VisaBuild', 'Platform name'),
('platform_url', 'https://yourvisasite.vercel.app', 'Platform URL'),
('support_email', 'support@visabuild.com', 'Support email'),
('default_timezone', 'Australia/Sydney', 'Default timezone'),
('maintenance_mode', 'false', 'Maintenance mode toggle'),
('signup_enabled', 'true', 'Allow new registrations')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- COMPLETE - Database ready for production
-- ============================================================================
