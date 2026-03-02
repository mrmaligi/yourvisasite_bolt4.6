-- Migration: Create document_categories table
-- Track: 001
-- Status: IN_PROGRESS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create document_categories table
CREATE TABLE IF NOT EXISTS public.document_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    tips TEXT,
    icon VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can read
CREATE POLICY "Allow public read access" ON public.document_categories
    FOR SELECT USING (is_active = true);

-- RLS Policy: Only admins can write
CREATE POLICY "Allow admin write access" ON public.document_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create index for ordering
CREATE INDEX idx_document_categories_order ON public.document_categories(display_order);
CREATE INDEX idx_document_categories_key ON public.document_categories(key);

-- Seed 19 document categories
INSERT INTO public.document_categories (key, name, description, tips, icon, display_order) VALUES
('identity', 'Identity Documents', 'Passport, birth certificate, national ID, and photographs', 'Ensure passport has 6+ months validity. Scan in color at 300 DPI. Include all stamped pages.', 'id-card', 1),
('character', 'Character Documents', 'Police clearances and statutory declarations', 'Request police checks early (4-8 weeks). Valid for 12 months. Required for all countries lived 12+ months.', 'shield-check', 2),
('health', 'Health Examinations', 'Medical examinations and health insurance', 'Book medical exam early (valid 12 months). Use only Home Affairs approved panel physicians.', 'heart-pulse', 3),
('english', 'English Language', 'IELTS, PTE, TOEFL, and Cambridge test results', 'Results valid 3 years. Book test early (slots fill up). Request official score reports.', 'languages', 4),
('financial', 'Financial Documents', 'Bank statements, payslips, and tax returns', 'Show funds held for minimum period. Explain any large deposits. Convert foreign currency to AUD.', 'wallet', 5),
('employment', 'Employment Documents', 'Reference letters, contracts, and CV', 'References must match nominated occupation. Include duties aligning with ANZSCO code.', 'briefcase', 6),
('qualifications', 'Qualifications', 'Degrees, transcripts, and professional licenses', 'Include all qualifications, not just highest. Get transcripts from all institutions.', 'graduation-cap', 7),
('skills_assessment', 'Skills Assessment', 'Assessment authority outcome letters', 'Must be valid at time of invitation. Keep assessment reference number handy.', 'certificate', 8),
('relationship', 'Relationship Evidence', 'Marriage certificates and evidence of cohabitation', 'Show evidence across all four categories: financial, household, social, commitment.', 'heart', 9),
('accommodation', 'Accommodation Documents', 'Lease agreements and property ownership', 'Show address matches application. Include duration covering visa period.', 'home', 10),
('sponsorship', 'Sponsorship Documents', 'Sponsor forms and evidence', 'Sponsor must meet income requirements. Some visas require sponsorship approval first.', 'user-check', 11),
('nomination', 'Nomination Documents', 'State or territory nomination letters', 'Must maintain commitment to nominated state. Check if nomination has conditions.', 'map-pin', 12),
('eoi', 'Expression of Interest', 'SkillSelect EOI screenshots', 'Ensure EOI information matches visa application. Update EOI if circumstances change.', 'file-text', 13),
('family_members', 'Family Members', 'Birth certificates and custody documents', 'Include all family members even if not migrating. Get consent from other parent for children.', 'users', 14),
('invitation', 'Invitation Documents', 'Invitation letters from hosts', 'Letter should be detailed and genuine. Include contact details for host.', 'mail', 15),
('travel_history', 'Travel History', 'Previous visas and passport stamps', 'Include all travel in last 10 years. Explain any visa refusals or cancellations.', 'plane', 16),
('genuine_temporary', 'Genuine Temporary Entrant', 'GS statements and ties to home country', 'Clearly explain reasons for returning home. Show strong ties to home country.', 'flag', 17),
('business', 'Business Documents', 'Company registration and financial statements', 'Show business is genuine and operating. Include financial history (2+ years).', 'building', 18),
('other', 'Other Documents', 'Additional supporting evidence', 'Use to explain any unusual circumstances. Keep explanations factual and concise.', 'file-plus', 19);

-- Verify insertion
SELECT COUNT(*) as total_categories FROM public.document_categories;
