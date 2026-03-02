-- Document Templates System
-- Downloadable templates for visa applications

CREATE TABLE IF NOT EXISTS document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'cover-letter', 'employment-letter', 'statutory-declaration', etc.
    visa_types TEXT[], -- applicable visa subclasses
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    download_count INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    price_cents INTEGER DEFAULT 0, -- if premium
    content_guide TEXT, -- instructions on how to use template
    sample_content TEXT, -- example filled-out content
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User template purchases
CREATE TABLE IF NOT EXISTS user_template_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
    price_paid_cents INTEGER NOT NULL,
    downloaded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, template_id)
);

-- Template reviews
CREATE TABLE IF NOT EXISTS template_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(template_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_document_templates_category ON document_templates(category);
CREATE INDEX IF NOT EXISTS idx_document_templates_visa_types ON document_templates USING GIN(visa_types);
CREATE INDEX IF NOT EXISTS idx_document_templates_active ON document_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_user_template_purchases_user ON user_template_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_template_reviews_template ON template_reviews(template_id);

-- RLS Policies
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_template_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_reviews ENABLE ROW LEVEL SECURITY;

-- Templates: readable by all
CREATE POLICY "Document templates are public"
    ON document_templates FOR SELECT
    USING (true);

-- Only admins can manage templates
CREATE POLICY "Only admins can insert templates"
    ON document_templates FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    ));

CREATE POLICY "Only admins can update templates"
    ON document_templates FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    ));

-- User purchases: users can view their own
CREATE POLICY "Users can view their purchases"
    ON user_template_purchases FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "System can create purchases"
    ON user_template_purchases FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Reviews: public read, authenticated write
CREATE POLICY "Template reviews are public"
    ON template_reviews FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can add reviews"
    ON template_reviews FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their reviews"
    ON template_reviews FOR UPDATE
    USING (user_id = auth.uid());

-- Function to calculate average rating
CREATE OR REPLACE FUNCTION get_template_average_rating(template_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT AVG(rating)::NUMERIC(3,2)
    INTO avg_rating
    FROM template_reviews
    WHERE template_id = template_uuid;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Sample templates
INSERT INTO document_templates (
    title, 
    description, 
    category, 
    visa_types, 
    file_url, 
    file_name,
    is_premium,
    price_cents,
    content_guide,
    sample_content
) VALUES 
(
    'Cover Letter Template - Skilled Visa',
    'Professional cover letter template for skilled visa applications (189, 190, 491)',
    'cover-letter',
    ARRAY['189', '190', '491'],
    'https://storage.visabuild.com/templates/cover-letter-skilled.docx',
    'cover-letter-skilled.docx',
    false,
    0,
    'Customize with your personal details, skills, and reasons for choosing Australia. Keep it concise (1 page).',
    'Dear Visa Officer,

I am writing to apply for the Skilled Independent visa (subclass 189). With 5 years of experience as a Software Engineer and a Bachelor degree from [University], I believe I meet the requirements for this visa...

[Your content here]'
),
(
    'Employer Reference Letter Template',
    'Standard format for employer reference letters required for work experience points',
    'employment-letter',
    ARRAY['189', '190', '491', '482', '186'],
    'https://storage.visabuild.com/templates/employer-reference.docx',
    'employer-reference.docx',
    true,
    1500,
    'Ensure your employer includes: company letterhead, your job title, dates of employment, duties/responsibilities, and contact details for verification.',
    '[Company Letterhead]

Date: [Date]

To Whom It May Concern,

This letter confirms that [Your Name] was employed with [Company Name] from [Start Date] to [End Date] in the position of [Job Title]...

[Template content]'
),
(
    'Statutory Declaration Template',
    'Template for statutory declarations commonly required for relationship evidence',
    'statutory-declaration',
    ARRAY['820', '801', '309', '100'],
    'https://storage.visabuild.com/templates/statutory-declaration.docx',
    'statutory-declaration.docx',
    false,
    0,
    'Must be witnessed by an authorized person (JP, lawyer, etc.). Include specific details about your relationship.',
    'I, [Full Name], of [Address], make the following declaration under the Statutory Declarations Act 1959:

1. I am the [partner/friend/relative] of [Applicant Name] and [Sponsor Name].
2. I have known the couple since [Date]...

[Continue with specific details]'
)
ON CONFLICT DO NOTHING;
