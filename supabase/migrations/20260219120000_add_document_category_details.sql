-- Migration: Add explanation and examples to document_categories
-- Track: 20260219120000

-- Add explanation and examples columns
ALTER TABLE public.document_categories
ADD COLUMN IF NOT EXISTS explanation TEXT,
ADD COLUMN IF NOT EXISTS examples TEXT[];

-- Update categories with new fields

-- Identity
UPDATE public.document_categories
SET explanation = 'Documents that prove your identity and citizenship status.',
    examples = ARRAY['Current Passport (Bio Page)', 'Birth Certificate', 'National ID Card', 'Marriage Certificate (if name change)']
WHERE key = 'identity';

-- Character
UPDATE public.document_categories
SET explanation = 'Evidence of good character and police clearance from countries you have lived in.',
    examples = ARRAY['Australian Federal Police Check', 'Overseas Police Clearance', 'Form 80 (Personal Particulars)', 'Form 1221']
WHERE key = 'character';

-- Health
UPDATE public.document_categories
SET explanation = 'Medical examinations and health assessments required for your visa application.',
    examples = ARRAY['HAP ID Letter', 'Medical Examination Report', 'Chest X-Ray Report', 'Polio Vaccination Certificate']
WHERE key = 'health';

-- English
UPDATE public.document_categories
SET explanation = 'Evidence of your English language proficiency.',
    examples = ARRAY['IELTS Test Report Form', 'PTE Academic Score Report', 'TOEFL iBT Score Report', 'Cambridge C1 Advanced Score']
WHERE key = 'english';

-- Financial
UPDATE public.document_categories
SET explanation = 'Evidence of your financial capacity to support your stay in Australia.',
    examples = ARRAY['Bank Statements (last 3 months)', 'Tax Returns (Notice of Assessment)', 'Payslips (last 3 months)', 'Employment Contract']
WHERE key = 'financial';

-- Employment
UPDATE public.document_categories
SET explanation = 'Evidence of your work history and employment claims.',
    examples = ARRAY['Employment Reference Letters', 'Payslips', 'Tax Documents', 'CV / Resume']
WHERE key = 'employment';

-- Qualifications
UPDATE public.document_categories
SET explanation = 'Documents proving your educational qualifications.',
    examples = ARRAY['Degree Certificate / Testamur', 'Academic Transcripts', 'Completion Letter', 'Trade Qualification']
WHERE key = 'qualifications';

-- Skills Assessment
UPDATE public.document_categories
SET explanation = 'Outcome of your skills assessment from the relevant assessing authority.',
    examples = ARRAY['Skills Assessment Outcome Letter', 'Employment Verification Report', 'Points Advice Letter']
WHERE key = 'skills_assessment';

-- Relationship
UPDATE public.document_categories
SET explanation = 'Evidence of your genuine and continuing relationship with your partner.',
    examples = ARRAY['Marriage Certificate', 'Relationship Registration Certificate', 'Joint Bank Account Statement', 'Statutory Declarations (Form 888)', 'Photos of Relationship']
WHERE key = 'relationship';

-- Accommodation
UPDATE public.document_categories
SET explanation = 'Evidence of where you will live in Australia.',
    examples = ARRAY['Lease Agreement', 'Property Ownership Title', 'Letter from Landlord', 'Utility Bills']
WHERE key = 'accommodation';

-- Sponsorship
UPDATE public.document_categories
SET explanation = 'Documents related to your sponsor.',
    examples = ARRAY['Sponsorship Approval Letter', 'Sponsor Passport / ID', 'Sponsor Employment Evidence', 'Sponsor Income Statement']
WHERE key = 'sponsorship';

-- Nomination
UPDATE public.document_categories
SET explanation = 'Documents related to state or territory nomination.',
    examples = ARRAY['State Nomination Approval Letter', 'Nomination Agreement', 'Commitment Statement']
WHERE key = 'nomination';

-- EOI
UPDATE public.document_categories
SET explanation = 'Evidence related to your Expression of Interest.',
    examples = ARRAY['EOI Summary PDF', 'Invitation to Apply Letter']
WHERE key = 'eoi';

-- Family Members
UPDATE public.document_categories
SET explanation = 'Documents for other family members included in the application.',
    examples = ARRAY['Dependant Birth Certificates', 'Passport Bio Pages', 'Form 1229 (Consent for child)', 'Adoption Papers']
WHERE key = 'family_members';

-- Invitation
UPDATE public.document_categories
SET explanation = 'Letters inviting you to visit Australia.',
    examples = ARRAY['Invitation Letter from Host', 'Host Passport / Visa Status', 'Host Address Proof', 'Itinerary']
WHERE key = 'invitation';

-- Travel History
UPDATE public.document_categories
SET explanation = 'Evidence of your previous travel history.',
    examples = ARRAY['Old Passports', 'Visa Grant Notices', 'Entry/Exit Stamps', 'Movement Records']
WHERE key = 'travel_history';

-- Genuine Temporary Entrant
UPDATE public.document_categories
SET explanation = 'Statement and evidence showing you intend to stay temporarily.',
    examples = ARRAY['GTE Statement', 'Evidence of Assets in Home Country', 'Employment Letter from Home Country', 'Family Ties Evidence']
WHERE key = 'genuine_temporary';

-- Business
UPDATE public.document_categories
SET explanation = 'Documents related to your business ownership or investment.',
    examples = ARRAY['Business Registration', 'Financial Statements (Profit & Loss)', 'Tax Returns for Business', 'BAS Statements']
WHERE key = 'business';

-- Other
UPDATE public.document_categories
SET explanation = 'Any other supporting documents relevant to your application.',
    examples = ARRAY['Cover Letter', 'Statutory Declarations', 'Name Change Certificate']
WHERE key = 'other';
