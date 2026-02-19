-- Community Forum System
-- Q&A platform for visa discussions

-- Forum categories (by visa type/topic)
CREATE TABLE IF NOT EXISTS forum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forum topics (threads)
CREATE TABLE IF NOT EXISTS forum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMPTZ,
    last_reply_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- Forum replies
CREATE TABLE IF NOT EXISTS forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    upvotes INTEGER DEFAULT 0,
    parent_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE, -- for nested replies
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Topic upvotes (separate table to track who upvoted)
CREATE TABLE IF NOT EXISTS forum_topic_votes (
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (topic_id, user_id)
);

-- Reply upvotes
CREATE TABLE IF NOT EXISTS forum_reply_votes (
    reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (reply_id, user_id)
);

-- Topic subscriptions (users following topics)
CREATE TABLE IF NOT EXISTS forum_subscriptions (
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (topic_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_author ON forum_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_created ON forum_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_topics_pinned ON forum_topics(is_pinned, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_topic ON forum_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_author ON forum_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_parent ON forum_replies(parent_id);

-- RLS Policies
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topic_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reply_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_subscriptions ENABLE ROW LEVEL SECURITY;

-- Categories: readable by all
CREATE POLICY "Forum categories are public"
    ON forum_categories FOR SELECT
    USING (true);

-- Topics: readable by all, creatable by authenticated
CREATE POLICY "Forum topics are public"
    ON forum_topics FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create topics"
    ON forum_topics FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their topics"
    ON forum_topics FOR UPDATE
    USING (author_id = auth.uid());

-- Replies: readable by all, creatable by authenticated
CREATE POLICY "Forum replies are public"
    ON forum_replies FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create replies"
    ON forum_replies FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their replies"
    ON forum_replies FOR UPDATE
    USING (author_id = auth.uid());

-- Votes: users can manage their own
CREATE POLICY "Users can view votes"
    ON forum_topic_votes FOR SELECT
    USING (true);

CREATE POLICY "Users can add their votes"
    ON forum_topic_votes FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their votes"
    ON forum_topic_votes FOR DELETE
    USING (user_id = auth.uid());

CREATE POLICY "Users can view reply votes"
    ON forum_reply_votes FOR SELECT
    USING (true);

CREATE POLICY "Users can add reply votes"
    ON forum_reply_votes FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove reply votes"
    ON forum_reply_votes FOR DELETE
    USING (user_id = auth.uid());

-- Subscriptions: users manage their own
CREATE POLICY "Users can view subscriptions"
    ON forum_subscriptions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can subscribe"
    ON forum_subscriptions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsubscribe"
    ON forum_subscriptions FOR DELETE
    USING (user_id = auth.uid());

-- Function to update topic reply count
CREATE OR REPLACE FUNCTION update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_topics 
        SET replies_count = replies_count + 1,
            last_reply_at = NEW.created_at,
            last_reply_by = NEW.author_id
        WHERE id = NEW.topic_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_topics 
        SET replies_count = replies_count - 1
        WHERE id = OLD.topic_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for reply count
DROP TRIGGER IF EXISTS trigger_update_reply_count ON forum_replies;
CREATE TRIGGER trigger_update_reply_count
    AFTER INSERT OR DELETE ON forum_replies
    FOR EACH ROW
    EXECUTE FUNCTION update_topic_reply_count();

-- Insert default categories
INSERT INTO forum_categories (name, slug, description, icon, display_order) VALUES
('General Discussion', 'general', 'General questions about Australian immigration', 'MessageCircle', 1),
('Work Visas', 'work-visas', 'Discussion about employer-sponsored and skilled work visas', 'Briefcase', 2),
('Student Visas', 'student-visas', 'Questions about studying in Australia', 'GraduationCap', 3),
('Family Visas', 'family-visas', 'Partner visas, parent visas, family sponsorship', 'Users', 4),
('Visitor Visas', 'visitor-visas', 'Tourist visas, working holiday visas', 'Plane', 5),
('Permanent Residency', 'permanent-residency', 'PR pathways, citizenship, and settling in Australia', 'Home', 6),
('Document Help', 'document-help', 'Help with forms, documents, and requirements', 'FileText', 7),
('Processing Times', 'processing-times', 'Share and discuss current processing times', 'Clock', 8),
('Success Stories', 'success-stories', 'Share your visa success story', 'Trophy', 9)
ON CONFLICT (slug) DO NOTHING;
