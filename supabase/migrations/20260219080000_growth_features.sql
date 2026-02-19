-- Referral System Migration
-- Tracks user referrals and rewards

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    referral_code TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted')),
    reward_amount INTEGER NOT NULL DEFAULT 2000, -- $20.00 in cents
    reward_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add referral_code to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_balance INTEGER NOT NULL DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- Eligibility Quiz Results
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    current_country TEXT,
    destination_country TEXT NOT NULL DEFAULT 'Australia',
    visa_purpose TEXT[], -- ['work', 'study', 'family', etc.]
    has_job_offer BOOLEAN,
    has_family_sponsor BOOLEAN,
    english_level TEXT,
    education_level TEXT,
    work_experience_years INTEGER,
    age_range TEXT,
    recommended_visas JSONB, -- [{visa_id, visa_name, eligibility_score, reasons}]
    eligibility_scores JSONB, -- Overall scores per category
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_email ON quiz_results(email);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);

-- Success Stories
CREATE TABLE IF NOT EXISTS success_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    visa_id UUID REFERENCES visas(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    story TEXT NOT NULL,
    timeline_days INTEGER,
    challenges TEXT,
    tips TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_success_stories_featured ON success_stories(is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_success_stories_visa_id ON success_stories(visa_id);

-- Email Notifications Queue
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'tracker_update', 'lawyer_reply', 'referral_converted', etc.
    subject TEXT NOT NULL,
    template_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_notifications_user_id ON email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);

-- User Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    email_tracker_updates BOOLEAN NOT NULL DEFAULT TRUE,
    email_lawyer_messages BOOLEAN NOT NULL DEFAULT TRUE,
    email_referral_updates BOOLEAN NOT NULL DEFAULT TRUE,
    email_marketing BOOLEAN NOT NULL DEFAULT FALSE,
    push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to generate referral code on user creation
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT) FROM 1 FOR 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral code
DROP TRIGGER IF EXISTS trigger_generate_referral_code ON profiles;
CREATE TRIGGER trigger_generate_referral_code
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- Function to award referral on conversion
CREATE OR REPLACE FUNCTION award_referral_reward()
RETURNS TRIGGER AS $$
BEGIN
    -- If user was referred and this is their first purchase
    IF NEW.referred_by IS NOT NULL AND OLD.referral_reward_claimed = FALSE THEN
        -- Add to referrer's balance
        UPDATE profiles 
        SET referral_balance = referral_balance + 2000
        WHERE id = NEW.referred_by;
        
        -- Mark as claimed
        NEW.referral_reward_claimed := TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Referrals policies
CREATE POLICY "Users can view own referrals"
    ON referrals FOR SELECT
    USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "Users can create referrals"
    ON referrals FOR INSERT
    WITH CHECK (referrer_id = auth.uid());

-- Quiz results policies
CREATE POLICY "Users can view own quiz results"
    ON quiz_results FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Anyone can create quiz results"
    ON quiz_results FOR INSERT
    WITH CHECK (true);

-- Success stories policies
CREATE POLICY "Published stories are public"
    ON success_stories FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Users can view own stories"
    ON success_stories FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own stories"
    ON success_stories FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own stories"
    ON success_stories FOR UPDATE
    USING (user_id = auth.uid());

-- Email notifications policies
CREATE POLICY "Users can view own notifications"
    ON email_notifications FOR SELECT
    USING (user_id = auth.uid());

-- Notification preferences policies
CREATE POLICY "Users can view own preferences"
    ON notification_preferences FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
    ON notification_preferences FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Auto-create preferences on insert"
    ON notification_preferences FOR INSERT
    WITH CHECK (user_id = auth.uid());
