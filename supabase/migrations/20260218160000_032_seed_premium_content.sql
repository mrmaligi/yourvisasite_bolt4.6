-- Migration: Seed Premium Content for Top 20 Visas
-- Track: 032
-- Status: IN_PROGRESS

-- 1. Recreate table with new schema
DROP TABLE IF EXISTS public.visa_premium_content;

CREATE TABLE public.visa_premium_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    document_category TEXT,
    document_explanation TEXT,
    document_example_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(visa_id, step_number)
);

-- Enable RLS
ALTER TABLE public.visa_premium_content ENABLE ROW LEVEL SECURITY;

-- RLS: Allow access if purchased or admin
CREATE POLICY "Allow access if purchased" ON public.visa_premium_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_visa_purchases
            WHERE user_id = auth.uid() AND visa_id = visa_premium_content.visa_id
            AND (expires_at IS NULL OR expires_at > NOW())
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS: Admin write
CREATE POLICY "Allow admin write" ON public.visa_premium_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX idx_premium_content_visa ON public.visa_premium_content(visa_id);

-- 2. Seed Data
CREATE OR REPLACE FUNCTION pg_temp.seed_visa_content(
    _subclass TEXT,
    _step INT,
    _title TEXT,
    _body TEXT,
    _doc_cat TEXT,
    _doc_exp TEXT
) RETURNS VOID AS $$
DECLARE
    _visa_id UUID;
BEGIN
    SELECT id INTO _visa_id FROM public.visas WHERE subclass = _subclass;
    IF _visa_id IS NOT NULL THEN
        INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
        VALUES (_visa_id, _step, _title, _body, _doc_cat, _doc_exp)
        ON CONFLICT (visa_id, step_number) DO UPDATE SET
            title = EXCLUDED.title,
            body = EXCLUDED.body,
            document_category = EXCLUDED.document_category,
            document_explanation = EXCLUDED.document_explanation,
            updated_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN

    -- 189 Skilled Independent
    PERFORM pg_temp.seed_visa_content('189', 1, 'Overview & Eligibility',
        E'<h3>Visa Overview</h3><p>The Skilled Independent visa (subclass 189) is a permanent visa for invited workers with skills needed in Australia. It allows you to live and work anywhere in Australia permanently.</p><h3>Key Eligibility Criteria</h3><ul><li><b>Points Test:</b> You must score at least 65 points on the points test.</li><li><b>Age:</b> You must be under 45 years of age when invited.</li><li><b>Skills Assessment:</b> You must have a positive skills assessment for an occupation on the Medium and Long-term Strategic Skills List (MLTSSL).</li><li><b>English:</b> You must have at least Competent English.</li></ul>',
        'Identity', 'Passport and birth certificate to prove age and identity.');

    PERFORM pg_temp.seed_visa_content('189', 2, 'Document Checklist',
        E'<h3>Required Documents</h3><p>Ensure you have high-quality color scans of all documents.</p><ul><li><b>Identity:</b> Current passport, birth certificate, national ID card.</li><li><b>Skills Assessment:</b> Positive skills assessment letter from the relevant authority.</li><li><b>English Language:</b> IELTS, PTE Academic, or TOEFL iBT test results (less than 3 years old).</li><li><b>Points Claims:</b> Documents to support points claimed for education, employment, partner skills, etc.</li><li><b>Character:</b> Police certificates from every country you lived in for 12 months or more in the last 10 years.</li></ul>',
        'Skills Assessment', 'Positive skills assessment from relevant authority.');

    PERFORM pg_temp.seed_visa_content('189', 3, 'Application Process',
        E'<h3>Step-by-Step Guide</h3><ol><li><b>Submit EOI:</b> Lodge an Expression of Interest (EOI) through SkillSelect. This is free.</li><li><b>Wait for Invitation:</b> Invitations are issued periodically based on points score and occupation ceilings.</li><li><b>Apply:</b> Once invited, you have 60 days to lodge your visa application through ImmiAccount.</li><li><b>Pay Fee:</b> Pay the visa application charge.</li><li><b>Attach Documents:</b> Upload all supporting documents to ImmiAccount immediately.</li></ol>',
        'EOI', 'Expression of Interest reference number.');

    PERFORM pg_temp.seed_visa_content('189', 4, 'Processing & Timeline',
        E'<h3>What to Expect</h3><p>Processing times can vary significantly based on Department priorities.</p><ul><li><b>Priority:</b> Health and education occupations are often prioritized.</li><li><b>Standard:</b> Most applications are processed within 8-18 months.</li><li><b>Health Exams:</b> You will be asked to undergo health examinations after lodging.</li><li><b>Delays:</b> Incomplete applications or requests for further information (s56 request) will delay processing.</li></ul>',
        'Health', 'HAP ID for health examinations.');

    PERFORM pg_temp.seed_visa_content('189', 5, 'After the Decision',
        E'<h3>Grant</h3><p>If granted, you are a permanent resident. You can live, work, and study anywhere in Australia. You can enroll in Medicare and sponsor eligible relatives.</p><h3>Refusal</h3><p>If refused, you may have the right to review the decision at the Administrative Appeals Tribunal (AAT). Strict time limits apply.</p><h3>Travel</h3><p>Your visa has a 5-year travel facility. After 5 years, you need a Resident Return Visa (RRV) to re-enter Australia.</p>',
        'Identity', 'Grant letter.');

    -- 190 Skilled Nominated
    PERFORM pg_temp.seed_visa_content('190', 1, 'Overview & Eligibility',
        E'<h3>Visa Overview</h3><p>The Skilled Nominated visa (subclass 190) is a permanent visa requiring nomination by an Australian state or territory government.</p><h3>Key Eligibility Criteria</h3><ul><li><b>Nomination:</b> You must be nominated by an Australian state or territory agency.</li><li><b>Points Test:</b> Score at least 65 points (including 5 points for state nomination).</li><li><b>Age:</b> Under 45 years when invited.</li><li><b>Skills Assessment:</b> Positive assessment for an occupation on the relevant skilled occupation list.</li></ul>',
        'Nomination', 'State nomination approval letter.');

    PERFORM pg_temp.seed_visa_content('190', 2, 'Document Checklist',
        E'<h3>Required Documents</h3><ul><li><b>Identity:</b> Passport, birth certificate.</li><li><b>State Nomination:</b> Evidence of state nomination approval.</li><li><b>Skills Assessment:</b> Valid skills assessment suitable for your nominated occupation.</li><li><b>English:</b> Competent English evidence.</li><li><b>Employment:</b> References, payslips, tax documents for claimed work experience.</li></ul>',
        'Nomination', 'State nomination confirmation.');

    PERFORM pg_temp.seed_visa_content('190', 3, 'Application Process',
        E'<h3>Step-by-Step Guide</h3><ol><li><b>Submit EOI:</b> Submit an EOI in SkillSelect indicating interest in state nomination (can select specific states or "Any").</li><li><b>State Application:</b> Apply directly to the state/territory for nomination (processes vary by state).</li><li><b>Invitation:</b> Once nominated, you receive an invitation to apply for the visa.</li><li><b>Visa Application:</b> Lodge the 190 visa application in ImmiAccount within 60 days.</li></ol>',
        'EOI', 'EOI Reference and State Application reference.');

    PERFORM pg_temp.seed_visa_content('190', 4, 'Processing & Timeline',
        E'<h3>Processing Times</h3><p>75% of applications: 10 months<br>90% of applications: 12 months</p><p>State nomination adds time before the visa application. Processing is generally faster than the 189 visa due to state priority.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('190', 5, 'After the Decision',
        E'<h3>Obligations</h3><p>You must typically live and work in the nominating state or territory for the first 2 years of your visa. This is a moral obligation to the state, though the visa itself is a permanent residence visa.</p><h3>Rights</h3><p>Access to Medicare, social security (waiting periods apply), and ability to apply for citizenship after meeting residence requirements.</p>',
        'Identity', 'Grant notification.');

    -- 491 Skilled Work Regional
    PERFORM pg_temp.seed_visa_content('491', 1, 'Overview & Eligibility',
        E'<h3>Visa Overview</h3><p>A provisional visa for skilled workers nominated by a state government or sponsored by an eligible family member to live and work in regional Australia.</p><h3>Eligibility</h3><ul><li><b>Nomination/Sponsorship:</b> Nominated by a state or sponsored by an eligible relative living in a designated regional area.</li><li><b>Points:</b> 65+ points (includes 15 points for regional nomination/sponsorship).</li><li><b>Age:</b> Under 45.</li><li><b>Duration:</b> 5 years. Pathway to PR (subclass 191) after 3 years.</li></ul>',
        'Sponsorship', 'Sponsorship or nomination approval.');

    PERFORM pg_temp.seed_visa_content('491', 2, 'Document Checklist',
        E'<h3>Required Documents</h3><ul><li><b>Identity & Relationship:</b> Passport, birth cert, marriage cert (if applicable).</li><li><b>Sponsor Documents:</b> Proof of sponsor''s residence in regional Australia (if family sponsored).</li><li><b>Skills Assessment:</b> Valid assessment.</li><li><b>English:</b> Competent English.</li><li><b>Residence:</b> Proof of intention to live in regional Australia.</li></ul>',
        'Sponsorship', 'Proof of sponsor residence (utility bills, lease).');

    PERFORM pg_temp.seed_visa_content('491', 3, 'Application Process',
        E'<h3>Step-by-Step</h3><ol><li><b>EOI:</b> Lodge EOI in SkillSelect.</li><li><b>Nomination:</b> Apply to state for nomination OR wait for invitation if family sponsored.</li><li><b>Invite:</b> Receive invitation to apply.</li><li><b>Apply:</b> Submit visa application in ImmiAccount within 60 days.</li></ol>',
        'EOI', 'EOI reference.');

    PERFORM pg_temp.seed_visa_content('491', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Regional visas are prioritized. Processing is typically 6-12 months.</p><p>Family sponsored stream can take longer due to limited places.</p>',
        'Health', 'Health examination results.');

    PERFORM pg_temp.seed_visa_content('491', 5, 'After the Decision',
        E'<h3>Conditions</h3><p><b>Condition 8579:</b> You must live, work, and study in a designated regional area. Breaching this can lead to cancellation.</p><h3>PR Pathway</h3><p>You can apply for the Permanent Residence (Skilled Regional) visa (subclass 191) after holding the 491 for 3 years and meeting income requirements (if any specified).</p>',
        'Identity', 'Visa grant notice with conditions.');

    -- 482 TSS
    PERFORM pg_temp.seed_visa_content('482', 1, 'Overview & Eligibility',
        E'<h3>Visa Overview</h3><p>Allows employers to address labor shortages by bringing in skilled workers where they cannot source an appropriately skilled Australian.</p><h3>Streams</h3><ul><li><b>Short-term:</b> Up to 2 years (or 4 if ITO). STSOL list.</li><li><b>Medium-term:</b> Up to 4 years. MLTSSL/ROL list. Pathway to PR.</li><li><b>Labour Agreement:</b> As per agreement.</li></ul><h3>Eligibility</h3><ul><li>Nominated by approved sponsor.</li><li>2 years work experience.</li><li>Skills assessment (if required).</li></ul>',
        'Employment', 'Resume/CV showing 2 years experience.');

    PERFORM pg_temp.seed_visa_content('482', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Identity:</b> Passport.</li><li><b>Skills:</b> Qualifications, CV, references for 2 years.</li><li><b>English:</b> Test results (unless exempt).</li><li><b>Insurance:</b> Adequate health insurance (OVHC).</li><li><b>Police Checks:</b> Required for many countries.</li></ul>',
        'Employment', 'Employer references.');

    PERFORM pg_temp.seed_visa_content('482', 3, 'Application Process',
        E'<h3>Three Steps</h3><ol><li><b>Sponsorship:</b> Employer applies to be a Standard Business Sponsor (SBS).</li><li><b>Nomination:</b> Employer nominates the position and you. Requires Labour Market Testing (LMT) unless exempt.</li><li><b>Visa:</b> You apply for the visa linked to the nomination.</li></ol>',
        'Nomination', 'Transaction Reference Number (TRN) of nomination.');

    PERFORM pg_temp.seed_visa_content('482', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Short-term: 1-3 months.<br>Medium-term: 1-3 months.</p><p>Accredited sponsors get priority processing (often < 1 week).</p>',
        'Health', 'Health insurance certificate.');

    PERFORM pg_temp.seed_visa_content('482', 5, 'After the Decision',
        E'<h3>Conditions</h3><p><b>Condition 8607:</b> Must only work for your sponsor in your nominated occupation. If you cease employment, you have 60 days to find a new sponsor or leave.</p>',
        'Employment', 'Employment contract.');

    -- 186 ENS
    PERFORM pg_temp.seed_visa_content('186', 1, 'Overview & Eligibility',
        E'<h3>Visa Overview</h3><p>Permanent residence for skilled workers nominated by an employer.</p><h3>Streams</h3><ul><li><b>Direct Entry (DE):</b> Skills assessment + 3 years experience.</li><li><b>Transition (TRT):</b> Held 457/482 for 2-3 years with same employer.</li><li><b>Labour Agreement:</b> As per agreement.</li></ul>',
        'Employment', 'Evidence of 3 years full-time experience.');

    PERFORM pg_temp.seed_visa_content('186', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Identity:</b> Passport, birth cert.</li><li><b>Skills:</b> Positive skills assessment (DE stream).</li><li><b>English:</b> Competent English.</li><li><b>Age:</b> Under 45 (exemptions apply).</li><li><b>Character:</b> Police checks.</li></ul>',
        'Skills Assessment', 'Skills assessment result.');

    PERFORM pg_temp.seed_visa_content('186', 3, 'Application Process',
        E'<h3>Two Stages</h3><ol><li><b>Nomination:</b> Employer nominates the position. Skilling Australians Fund (SAF) levy applies.</li><li><b>Visa:</b> Applicant lodges visa application. Can be done simultaneously with nomination.</li></ol>',
        'Nomination', 'Nomination TRN.');

    PERFORM pg_temp.seed_visa_content('186', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Direct Entry: 3-10 months.<br>Transition: 3-12 months.</p><p>Ensure nomination is decision-ready to avoid delays.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('186', 5, 'After the Decision',
        E'<h3>Grant</h3><p>Permanent residence. You should intend to work for the sponsor for at least 2 years, but the visa is not cancelled if you leave, provided the intention was genuine at time of grant.</p>',
        'Identity', 'Grant letter.');

    -- 500 Student
    PERFORM pg_temp.seed_visa_content('500', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>Allows you to stay in Australia to study full-time at a recognized educational institution.</p><h3>Criteria</h3><ul><li><b>Enrolment:</b> Confirmation of Enrolment (CoE).</li><li><b>GTE/GS:</b> Genuine Student requirement.</li><li><b>Financials:</b> Funds to cover 1 year of tuition and living costs.</li><li><b>English:</b> Evidence of English proficiency.</li><li><b>Health/Character:</b> Meet requirements.</li></ul>',
        'Qualifications', 'Confirmation of Enrolment (CoE).');

    PERFORM pg_temp.seed_visa_content('500', 2, 'Document Checklist',
        E'<h3>Checklist</h3><ul><li><b>Identity:</b> Passport.</li><li><b>Education:</b> CoE for all courses.</li><li><b>GTE:</b> Statement of purpose, ties to home country.</li><li><b>Financial:</b> Bank statements, loan documents, or scholarship letter.</li><li><b>Health Insurance:</b> OSHC policy.</li></ul>',
        'Financial', 'Bank statements showing funds.');

    PERFORM pg_temp.seed_visa_content('500', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Apply to School:</b> Get accepted and pay deposit to receive CoE.</li><li><b>Organize OSHC:</b> Purchase Overseas Student Health Cover.</li><li><b>Apply for Visa:</b> Lodge online via ImmiAccount.</li><li><b>Biometrics:</b> Provide biometrics if requested.</li></ol>',
        'Health', 'OSHC certificate.');

    PERFORM pg_temp.seed_visa_content('500', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Higher Education: 1-3 months.<br>VET: 3-6 months.</p><p>Apply at least 6 weeks before course starts. Processing peaks before semester starts.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('500', 5, 'After the Decision',
        E'<h3>Conditions</h3><ul><li><b>8105:</b> Work limitation (48 hours per fortnight during term).</li><li><b>8202:</b> Maintain enrolment and course progress.</li><li><b>8501:</b> Maintain health insurance.</li></ul>',
        'Identity', 'Visa grant.');

    -- 485 Temporary Graduate
    PERFORM pg_temp.seed_visa_content('485', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>For international students who have recently graduated from an Australian institution.</p><h3>Streams</h3><ul><li><b>Graduate Work:</b> Skills assessment required. For trade/diploma qualifications relevant to MLTSSL.</li><li><b>Post-Study Work:</b> No skills assessment. For degree holders (Bachelor and up).</li></ul>',
        'Qualifications', 'Completion letter and transcript.');

    PERFORM pg_temp.seed_visa_content('485', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Study:</b> Completion letter, transcripts stating course dates (min 92 weeks study).</li><li><b>English:</b> Test in last 12 months (e.g. IELTS 6.5).</li><li><b>AFP Check:</b> Apply for AFP check BEFORE lodging visa.</li><li><b>Insurance:</b> OVHC.</li></ul>',
        'Character', 'AFP Check receipt or certificate.');

    PERFORM pg_temp.seed_visa_content('485', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Completion:</b> Wait for official course completion.</li><li><b>Apply AFP:</b> Request police check.</li><li><b>Lodge:</b> Apply within 6 months of course completion.</li></ol><p><b>Critical:</b> You must apply for the AFP check before submitting the visa application.</p>',
        'Character', 'Proof of AFP application.');

    PERFORM pg_temp.seed_visa_content('485', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Generally 3-6 months. You will hold a Bridging Visa A allowing you to work full-time while processing.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('485', 5, 'After the Decision',
        E'<h3>Rights</h3><p>Full work and study rights. You are responsible for your own health insurance (OVHC).</p><p>Duration depends on qualification (2-4 years).</p>',
        'Identity', 'Grant notice.');

    -- 600 Visitor
    PERFORM pg_temp.seed_visa_content('600', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>For tourism, visiting family, or business visitor activities. Does not allow work.</p><h3>Streams</h3><ul><li><b>Tourist:</b> Holiday or visiting friends.</li><li><b>Sponsored Family:</b> Formal sponsorship by relative.</li><li><b>Business Visitor:</b> Meetings, conferences (no paid work).</li></ul>',
        'Financial', 'Evidence of funds for stay.');

    PERFORM pg_temp.seed_visa_content('600', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Identity:</b> Passport.</li><li><b>Financials:</b> Bank statements, payslips, or letter of support.</li><li><b>Itinerary:</b> Travel plans (do not book flights yet).</li><li><b>Ties:</b> Letter from employer, property deeds to show you will return home.</li></ul>',
        'Financial', 'Bank statements.');

    PERFORM pg_temp.seed_visa_content('600', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Lodge:</b> Apply via ImmiAccount.</li><li><b>Biometrics:</b> Provide biometrics if required.</li><li><b>Health:</b> Exam required for stays >6 months or if over 75.</li></ol>',
        'Identity', 'Passport bio page.');

    PERFORM pg_temp.seed_visa_content('600', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Standard: 2-4 weeks.</p><p>Peak periods (Christmas) can take longer. Apply early.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('600', 5, 'After the Decision',
        E'<h3>Conditions</h3><ul><li><b>8101:</b> No work.</li><li><b>8201:</b> Max 3 months study.</li><li><b>8503:</b> No further stay (if attached).</li></ul>',
        'Identity', 'Grant letter.');

    -- 601 ETA
    PERFORM pg_temp.seed_visa_content('601', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>Electronic Travel Authority. For passport holders of specific countries (e.g., USA, Canada, Japan, Singapore).</p><p>Allows visits up to 3 months per entry for 12 months.</p>',
        'Identity', 'Eligible passport.');

    PERFORM pg_temp.seed_visa_content('601', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Passport:</b> Must be valid.</li><li><b>App:</b> Apply via the Australian ETA app on mobile.</li></ul>',
        'Identity', 'Passport.');

    PERFORM pg_temp.seed_visa_content('601', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Download App:</b> Australian ETA app.</li><li><b>Scan Passport:</b> Use phone NFC.</li><li><b>Photo:</b> Take selfie.</li><li><b>Answer Questions:</b> Criminal history, address.</li><li><b>Pay:</b> Service fee AUD $20.</li></ol>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('601', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Usually instant or within 24 hours.</p><p>If referred for further checking, can take weeks.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('601', 5, 'After the Decision',
        E'<h3>Conditions</h3><p>No work. Max 3 months per visit. Multiple entries allowed for 1 year.</p>',
        'Identity', 'N/A');

    -- 651 eVisitor
    PERFORM pg_temp.seed_visa_content('651', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>Free visitor visa for European passport holders (e.g., UK, France, Germany).</p><p>Stay up to 3 months per visit.</p>',
        'Identity', 'European passport.');

    PERFORM pg_temp.seed_visa_content('651', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Passport:</b> Valid European passport.</li></ul>',
        'Identity', 'Passport.');

    PERFORM pg_temp.seed_visa_content('651', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>ImmiAccount:</b> Apply online via ImmiAccount.</li><li><b>Details:</b> Enter passport details exactly.</li><li><b>Submit:</b> Free of charge.</li></ol>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('651', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Usually 1-2 days.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('651', 5, 'After the Decision',
        E'<h3>Conditions</h3><p>No work. Business visitor activities allowed. Max 3 months per stay.</p>',
        'Identity', 'Grant notice.');

    -- 820/801 Partner Onshore
    PERFORM pg_temp.seed_visa_content('820/801', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>For partners of Australian citizens/PRs who are currently IN Australia.</p><h3>Two Stages</h3><p>You apply for 820 (Temp) and 801 (Perm) at the same time. 820 is processed first. 2 years later, 801 is assessed.</p><h3>Relationship</h3><p>Married or De Facto (usually 12 months cohabitation or registered).</p>',
        'Relationship', 'Marriage certificate or relationship registration.');

    PERFORM pg_temp.seed_visa_content('820/801', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Identity:</b> Passports for both.</li><li><b>Relationship:</b> 4 Pillars: Financial, Household, Social, Commitment.</li><li><b>Form 888:</b> Two statutory declarations from witnesses.</li><li><b>Police Checks:</b> Both applicant and sponsor.</li></ul>',
        'Relationship', 'Joint bank account, lease, photos.');

    PERFORM pg_temp.seed_visa_content('820/801', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Applicant:</b> Lodges Form 47SP online.</li><li><b>Sponsor:</b> Lodges Form 40SP online (linked to applicant).</li><li><b>Upload:</b> Evidence of genuine relationship is key.</li></ol>',
        'Sponsorship', 'Sponsor application reference.');

    PERFORM pg_temp.seed_visa_content('820/801', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>820: 6-24 months.</p><p>You get a BVA to stay in Australia. Work rights included.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('820/801', 5, 'After the Decision',
        E'<h3>Temp to Perm</h3><p>If 820 granted, wait until 2 years from initial application date to provide further evidence for 801 permanent stage.</p>',
        'Identity', 'Grant letter.');

    -- 309/100 Partner Offshore
    PERFORM pg_temp.seed_visa_content('309/100', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>For partners of Australian citizens/PRs who are OUTSIDE Australia.</p><h3>Process</h3><p>Similar to 820/801 but applied offshore. Must be offshore for grant of 309 (unless concession applies).</p>',
        'Relationship', 'Marriage cert or de facto evidence.');

    PERFORM pg_temp.seed_visa_content('309/100', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Relationship:</b> Evidence of genuine relationship despite being offshore/apart (communication logs).</li><li><b>Identity:</b> Both parties.</li><li><b>Sponsor:</b> Citizenship proof.</li></ul>',
        'Relationship', 'Chat logs, travel history together.');

    PERFORM pg_temp.seed_visa_content('309/100', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Apply:</b> Lodge online via ImmiAccount.</li><li><b>Sponsor:</b> Complete sponsorship form.</li><li><b>Wait:</b> Processing happens while you are offshore.</li></ol>',
        'Sponsorship', 'Sponsorship form.');

    PERFORM pg_temp.seed_visa_content('309/100', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>309: 12-24 months.</p><p>Can visit Australia on visitor visa while waiting, but must notify Department.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('309/100', 5, 'After the Decision',
        E'<h3>Travel</h3><p>Once 309 granted, you can move to Australia. Work rights included. Wait for 100 permanent stage (2 years from application).</p>',
        'Identity', 'Grant notice.');

    -- 300 Prospective Marriage
    PERFORM pg_temp.seed_visa_content('300', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>Fiancé visa. Allows you to come to Australia to marry your sponsor.</p><h3>Eligibility</h3><ul><li>Must be outside Australia to apply and be granted.</li><li>Must have met in person.</li><li>Must intend to marry within visa period (9-15 months).</li></ul>',
        'Relationship', 'Letter from celebrant (NOIM).');

    PERFORM pg_temp.seed_visa_content('300', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Relationship:</b> Proof of meeting in person, engagement.</li><li><b>Marriage:</b> Notice of Intended Marriage (NOIM) letter from celebrant.</li><li><b>Identity:</b> Passports.</li></ul>',
        'Relationship', 'Photos of meeting in person.');

    PERFORM pg_temp.seed_visa_content('300', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Lodge:</b> Apply offshore.</li><li><b>Wait:</b> Wait for grant.</li><li><b>Travel:</b> Enter Australia once granted.</li><li><b>Marry:</b> Marry within the visa validity period.</li><li><b>Next:</b> Apply for 820/801 onshore.</li></ol>',
        'Relationship', 'NOIM.');

    PERFORM pg_temp.seed_visa_content('300', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>12-18 months. Processing times vary.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('300', 5, 'After the Decision',
        E'<h3>After Arrival</h3><p>You must marry your sponsor and apply for the Partner visa (820/801) before the 300 visa expires.</p>',
        'Identity', 'Grant letter.');

    -- 417 Working Holiday
    PERFORM pg_temp.seed_visa_content('417', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>For young people (18-30 or 35) from eligible countries (e.g. UK, Canada, Germany) to holiday and work.</p><h3>Country List</h3><p>Check if your passport is on the 417 list. If not, check 462.</p>',
        'Identity', 'Eligible passport.');

    PERFORM pg_temp.seed_visa_content('417', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Passport:</b> Valid.</li><li><b>Funds:</b> AUD $5000 + flight money.</li><li><b>Health:</b> Meet requirements.</li></ul>',
        'Financial', 'Bank statement.');

    PERFORM pg_temp.seed_visa_content('417', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Apply:</b> Online via ImmiAccount.</li><li><b>Pay:</b> Visa fee.</li><li><b>Wait:</b> Usually fast.</li></ol>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('417', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>1-14 days. Very fast.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('417', 5, 'After the Decision',
        E'<h3>Rights</h3><p>12 months stay. Max 6 months work with one employer. Can apply for 2nd and 3rd year visa if specified work completed.</p>',
        'Employment', 'Pay slips for specified work (for renewal).');

    -- 462 Work and Holiday
    PERFORM pg_temp.seed_visa_content('462', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>For young people (18-30) from countries NOT on 417 list (e.g. USA, China, Spain).</p><h3>Education</h3><p>Often requires tertiary education evidence and functional English.</p>',
        'Qualifications', 'Degree or transcript.');

    PERFORM pg_temp.seed_visa_content('462', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Education:</b> Proof of completion or 2 years study.</li><li><b>English:</b> Test results.</li><li><b>Funds:</b> AUD $5000.</li><li><b>Support:</b> Letter of support (for some countries).</li></ul>',
        'English Language', 'English test results.');

    PERFORM pg_temp.seed_visa_content('462', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Check Cap:</b> Some countries have annual caps.</li><li><b>Apply:</b> Online ImmiAccount.</li><li><b>Upload:</b> All education and English evidence.</li></ol>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('462', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Variable. 2 weeks to 3 months.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('462', 5, 'After the Decision',
        E'<h3>Rights</h3><p>Same as 417. 12 months stay. Specific work required for extension.</p>',
        'Identity', 'Grant letter.');

    -- 143 Contributory Parent
    PERFORM pg_temp.seed_visa_content('143', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>Permanent visa for parents of settled Australian citizens/PRs.</p><h3>Balance of Family</h3><p>At least half your children must live permanently in Australia.</p><h3>Cost</h3><p>High cost (approx $48k per person) but faster than non-contributory.</p>',
        'Relationship', 'Birth certificates of all children.');

    PERFORM pg_temp.seed_visa_content('143', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Sponsor:</b> Child''s citizenship/PR proof.</li><li><b>Family:</b> Evidence of all children''s residence.</li><li><b>AoS:</b> Assurance of Support bond required later.</li></ul>',
        'Financial', 'Assurance of Support.');

    PERFORM pg_temp.seed_visa_content('143', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Lodge:</b> Paper application (posted to Perth).</li><li><b>Queue:</b> Wait for queue date.</li><li><b>Wait:</b> Long wait (currently 6-12 years).</li><li><b>Request:</b> Pay 2nd installment when requested.</li></ol>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('143', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Currently estimated at 12+ years despite being "contributory".</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('143', 5, 'After the Decision',
        E'<h3>Grant</h3><p>Permanent residence. 10 year wait for pension.</p>',
        'Identity', 'Grant letter.');

    -- 188 Business Innovation
    PERFORM pg_temp.seed_visa_content('188', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>Provisional visa for business owners and investors.</p><h3>Streams</h3><ul><li><b>Business Innovation:</b> Own and manage a business.</li><li><b>Investor:</b> Invest $2.5m (now closed/changed, check latest).</li><li><b>Significant Investor:</b> Invest $5m.</li></ul>',
        'Financial', 'Audited accounts.');

    PERFORM pg_temp.seed_visa_content('188', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Business:</b> BAS, tax returns, financial statements.</li><li><b>Assets:</b> Net asset valuation.</li><li><b>Points:</b> 65 points required for Innovation stream.</li></ul>',
        'Financial', 'Business financial statements.');

    PERFORM pg_temp.seed_visa_content('188', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>EOI:</b> Submit EOI.</li><li><b>Nomination:</b> Apply for state nomination.</li><li><b>Apply:</b> Lodge visa.</li></ol>',
        'EOI', 'EOI reference.');

    PERFORM pg_temp.seed_visa_content('188', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>12-24 months. Complex assessment.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('188', 5, 'After the Decision',
        E'<h3>Provisional</h3><p>Valid for 5 years. Must meet turnover/investment requirements to apply for permanent 888 visa.</p>',
        'Identity', 'Grant notice.');

    -- 858 Global Talent
    PERFORM pg_temp.seed_visa_content('858', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>Permanent visa for exceptionally talented individuals in target sectors.</p><h3>Criteria</h3><ul><li><b>Prominence:</b> Internationally recognized.</li><li><b>Salary:</b> Ability to earn >$175k AUD.</li><li><b>Nominator:</b> Nominated by eligible Australian individual or org.</li></ul>',
        'Nomination', 'Form 1000 Nominator record.');

    PERFORM pg_temp.seed_visa_content('858', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Achievement:</b> Awards, patents, media articles, keynote speeches.</li><li><b>Salary:</b> Pay slips, contract, or salary survey.</li><li><b>Nominator:</b> Form 1000 signed by nominator.</li></ul>',
        'Qualifications', 'Evidence of awards/achievements.');

    PERFORM pg_temp.seed_visa_content('858', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>EOI:</b> Submit Global Talent EOI.</li><li><b>Invite:</b> Receive Unique Identifier.</li><li><b>Apply:</b> Lodge visa with priority processing.</li></ol>',
        'EOI', 'Global Talent Unique Identifier.');

    PERFORM pg_temp.seed_visa_content('858', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>EOI: 1-12 months.<br>Visa: 1-6 months.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('858', 5, 'After the Decision',
        E'<h3>Grant</h3><p>Direct permanent residence.</p>',
        'Identity', 'Grant letter.');

    -- 866 Protection
    PERFORM pg_temp.seed_visa_content('866', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>Permanent visa for people in Australia who engage Australia''s protection obligations (refugees).</p><h3>Criteria</h3><p>Well-founded fear of persecution based on race, religion, nationality, membership of a particular social group, or political opinion.</p>',
        'Identity', 'Statement of claims.');

    PERFORM pg_temp.seed_visa_content('866', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Identity:</b> Passport (if available).</li><li><b>Claims:</b> detailed statement explaining fear of return.</li><li><b>Evidence:</b> Documents supporting claims (arrest warrants, medical reports).</li></ul>',
        'Identity', 'Statutory declaration of claims.');

    PERFORM pg_temp.seed_visa_content('866', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Lodge:</b> Apply via ImmiAccount or paper.</li><li><b>Interview:</b> Attend interview to discuss claims.</li><li><b>Decision:</b> Wait for outcome.</li></ol>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('866', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>Variables. Can take 2-4 years.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('866', 5, 'After the Decision',
        E'<h3>Grant</h3><p>Permanent residence. Access to settlement services.</p>',
        'Identity', 'Grant letter.');

    -- 870 Sponsored Parent
    PERFORM pg_temp.seed_visa_content('870', 1, 'Overview & Eligibility',
        E'<h3>Overview</h3><p>Temporary visa for parents. Up to 5 years per grant. Max 10 years cumulative.</p><h3>Sponsorship</h3><p>Child must be approved as Parent Sponsor first.</p><h3>No Balance of Family</h3><p>Does not require balance of family test.</p>',
        'Sponsorship', 'Sponsorship approval.');

    PERFORM pg_temp.seed_visa_content('870', 2, 'Document Checklist',
        E'<h3>Documents</h3><ul><li><b>Sponsor:</b> Approval letter.</li><li><b>Identity:</b> Passport.</li><li><b>Funds:</b> Evidence of access to funds.</li><li><b>Insurance:</b> Health insurance.</li></ul>',
        'Financial', 'Proof of funds.');

    PERFORM pg_temp.seed_visa_content('870', 3, 'Application Process',
        E'<h3>Steps</h3><ol><li><b>Sponsorship:</b> Child applies for sponsorship ($420).</li><li><b>Visa:</b> Once sponsored, parent applies for visa ($5000+).</li></ol>',
        'Sponsorship', 'Sponsorship ID.');

    PERFORM pg_temp.seed_visa_content('870', 4, 'Processing & Timeline',
        E'<h3>Timeline</h3><p>4-6 months.</p>',
        'Identity', 'N/A');

    PERFORM pg_temp.seed_visa_content('870', 5, 'After the Decision',
        E'<h3>Conditions</h3><p>No work rights. Must maintain health insurance. Cannot apply for permanent parent visa while holding this visa.</p>',
        'Identity', 'Grant letter.');

END $$;

-- 3. Cleanup
DROP FUNCTION pg_temp.seed_visa_content(TEXT, INT, TEXT, TEXT, TEXT, TEXT);
