-- Migration: Create document_examples table and seed sample documents
-- Tracks: 015, 016
-- Status: IN_PROGRESS

-- Create document_examples table
CREATE TABLE IF NOT EXISTS public.document_examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_category_id UUID REFERENCES public.document_categories(id),
    visa_id UUID REFERENCES public.visas(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    example_type VARCHAR(50), -- 'template', 'sample', 'guide'
    file_url TEXT,
    content TEXT, -- For text-based examples
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.document_examples ENABLE ROW LEVEL SECURITY;

-- RLS: Public read (used in premium content)
CREATE POLICY "Allow public read access" ON public.document_examples
    FOR SELECT USING (is_public = true);

-- RLS: Admin write
CREATE POLICY "Allow admin write access" ON public.document_examples
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX idx_doc_examples_category ON public.document_examples(document_category_id);
CREATE INDEX idx_doc_examples_visa ON public.document_examples(visa_id);

-- Seed example documents for each category
INSERT INTO public.document_examples (document_category_id, title, description, example_type, content) VALUES
((SELECT id FROM public.document_categories WHERE key = 'identity'), 'Passport Bio Page Example', 'Correct way to scan passport bio page', 'guide', 
E'# Passport Bio Page Requirements

## Scan Quality
- Resolution: Minimum 300 DPI
- Format: Color (not black & white)
- Format: PDF or high-quality JPG
- Size: Under 10MB per file

## What to Include
1. Full bio page (page with photo)
2. Machine-readable zone (bottom 2 lines)
3. All edges visible, no cropping
4. No shadows or glare on photo

## Common Issues
❌ Blurry scans
❌ Cut-off edges
❌ Black and white
❌ Finger covering details
✅ Clear, color, full page

## Translation
If passport not in English, provide NAATI-certified translation.'),

((SELECT id FROM public.document_categories WHERE key = 'character'), 'Police Clearance Example', 'Sample Australian Federal Police check', 'sample',
E'# Police Clearance Certificate

## Australian Federal Police (AFP) Check

**Name:** [Applicant Name]
**Date of Birth:** [DOB]
**Purpose:** Immigration/Citizenship - Visa Subclass [XXX]

**Result:** NO DISCLOSABLE COURT OUTCOMES

This is to certify that a search of the records held by the Australian Federal Police has been completed with the following result:

Based on the information provided and available to the AFP, the above named person has NO disclosable court outcomes.

**Reference Number:** AFP-[NUMBER]
**Date Issued:** [DATE]
**Valid Until:** [DATE + 12 months]

---

## Overseas Police Checks

Each country has different procedures:
- **USA:** FBI Identity History Summary
- **UK:** ACRO Police Certificate
- **India:** PCC from Regional Passport Office
- **China:** Notary Certificate of No Criminal Record

Processing time: 2-8 weeks typically.'),

((SELECT id FROM public.document_categories WHERE key = 'employment'), 'Employment Reference Letter Template', 'Template for employer reference letter', 'template',
E'[Company Letterhead]

Date: [DATE]

To Whom It May Concern,

RE: Employment Reference for [EMPLOYEE NAME]

This letter confirms that [EMPLOYEE NAME] has been employed with [COMPANY NAME] as a [JOB TITLE] from [START DATE] to [END DATE / Present].

**Key Responsibilities:**
• [Duty 1 matching ANZSCO description]
• [Duty 2 matching ANZSCO description]
• [Duty 3 matching ANZSCO description]
• [Duty 4 matching ANZSCO description]
• [Duty 5 matching ANZSCO description]

**Employment Details:**
- Position: [Exact Job Title]
- Hours: [Full-time/Part-time, hours per week]
- Salary: [Annual salary or hourly rate]
- Reporting to: [Manager name and title]

[Employee Name] has performed their duties to a high standard and we wish them every success in their future endeavors.

Yours sincerely,

[Signature]
[Name]
[Title]
[Direct Phone Number]
[Email Address]');

-- Verify
SELECT COUNT(*) as examples_created FROM public.document_examples;
