/*
  # Visa Data Expansion: New Zealand, Canada FST, UK Family (Cycle 5)

  Adds 3 new visas expanding coverage to 17 total visas across 4 countries.
  
  Sources referenced (accessed 18 Feb 2026):
    - Immigration NZ – Skilled Migrant Category: https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/skilled-migrant-category
    - IRCC – Federal Skilled Trades Program: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/skilled-trades.html
    - UK Gov – Family visas: https://www.gov.uk/uk-family-visa
    - UK Gov – Partner visa processing times: https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk
*/

-- =============================================================
-- New Zealand – Skilled Migrant Category (SMC)
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  'SMC',
  'Skilled Migrant Category (Residence)',
  'New Zealand',
  'work',
  'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/skilled-migrant-category',
  'New Zealand''s primary residence pathway for skilled workers. Points-based system assessing age, skilled employment, qualifications, and work experience. Successful applicants receive permanent residence with full work and study rights.',
  'NZD $4,290 (application fee) + NZD $2,150 (immigration levy) = NZD $6,440 total for principal applicant. Additional fees for partners/children.',
  true
)
ON CONFLICT (subclass_number) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  category = EXCLUDED.category,
  official_url = EXCLUDED.official_url,
  summary = EXCLUDED.summary,
  processing_fee_description = EXCLUDED.processing_fee_description,
  is_active = true,
  updated_at = now();

INSERT INTO public.visa_requirements (visa_id, requirements_json)
SELECT
  v.id,
  jsonb_build_object(
    'eligibility', jsonb_build_array(
      'Score at least 180 points on the Skilled Migrant Category points scale (age, employment, qualifications, experience).',
      'Have skilled employment in New Zealand OR an offer of skilled employment, OR have completed a recognized NZ qualification meeting requirements.',
      'Be under 55 years of age at the time of application.',
      'Meet English language requirements: IELTS 6.5+ overall (or equivalent PTE, TOEFL, or NZCEL Level 4).',
      'Meet health and character requirements (medical exams, police certificates).',
      'Your occupation must be at skill level 1, 2, or 3 on the ANZSCO list.',
      'Demonstrate genuine intent to live and work in New Zealand.'
    ),
    'documents', jsonb_build_object(
      'identity', jsonb_build_array('Valid passport', 'Birth certificate', 'Marriage/civil union certificate (if applicable)'),
      'employment', jsonb_build_array('Employment agreement or offer letter (signed, with job description)', 'Job description showing ANZSCO skill level', 'Evidence of relevant work experience (reference letters, contracts)', 'Professional registration (if required for occupation)'),
      'qualifications', jsonb_build_array('Degree/diploma certificates', 'Academic transcripts', 'NZQA International Qualification Assessment (IQA) if qualification is from overseas'),
      'language', jsonb_build_array('IELTS Academic or General Training results (minimum 6.5 overall)', 'Or PTE Academic, TOEFL iBT, or NZCEL Level 4 certificate'),
      'health', jsonb_build_array('Medical examination by an Immigration NZ panel physician', 'Chest X-ray certificate (if applicable)'),
      'character', jsonb_build_array('Police certificates from all countries lived in 12+ months in last 10 years', 'Military service records (if applicable)')
    ),
    'processing_times', jsonb_build_object(
      'summary', 'Processing times vary significantly based on application complexity and volume. Straightforward applications: 4-6 months. Complex cases: 12-24 months. Skilled Migrant Category is currently highly competitive with high point thresholds.',
      'source', 'https://www.immigration.govt.nz/about-us/what-we-do/our-operations/visa-processing-times',
      'last_checked', '2026-02-18'
    ),
    'citations', jsonb_build_array(
      jsonb_build_object(
        'label', 'Immigration NZ – Skilled Migrant Category',
        'url', 'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/skilled-migrant-category',
        'accessed', '2026-02-18'
      ),
      jsonb_build_object(
        'label', 'Immigration NZ – Points scale',
        'url', 'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/skilled-migrant-category/points-scale',
        'accessed', '2026-02-18'
      )
    )
  )
FROM public.visas v
WHERE v.subclass_number = 'SMC'
ON CONFLICT (visa_id) DO UPDATE SET
  requirements_json = EXCLUDED.requirements_json,
  updated_at = now();

-- Premium content for NZ SMC
INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1,
  'Check your points eligibility',
  E'Before applying, calculate your points using Immigration NZ''s official points scale. You need at least 180 points to be competitive (thresholds vary; check current requirements).

Key factors: Age (max 30 points for 20-39), Skilled employment (max 70 points), Qualifications (max 70 points for PhD, 50 for Bachelor''s), Work experience (max 30 points for 10+ years).

Critical: You MUST have either skilled employment in NZ OR a job offer to claim points for skilled employment. This is often the largest points component.',
  'Points Calculator',
  'Use Immigration NZ''s online points calculator or the ANZSCO occupation list to verify your job is at the right skill level (1, 2, or 3).'
FROM public.visas v WHERE v.subclass_number = 'SMC'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2,
  'Get your qualifications assessed (if overseas)',
  E'If your qualification is from outside New Zealand, you need a New Zealand Qualifications Authority (NZQA) International Qualifications Assessment (IQA).

The IQA compares your overseas qualification to the NZ Qualifications Framework and determines the NZ level equivalent. This process takes 25-35 working days currently.

Cost: NZD $445 for the first qualification, NZD $275 for each additional qualification. Start this early—it is a common bottleneck.',
  'NZQA IQA Report',
  'Your IQA report must be less than 2 years old when you submit your residence application.'
FROM public.visas v WHERE v.subclass_number = 'SMC'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 3,
  'Submit your Expression of Interest (EOI)',
  E'The EOI is not an application—it is a declaration of your interest in applying. You submit it through the Immigration NZ portal.

Include: Personal details, points claim details (with evidence references), health and character declarations.

Once submitted, your EOI enters the pool. Selections occur every 2 weeks. Only EOIs with 180+ points (or those with job offers meeting criteria) are selected. If selected, you receive an Invitation to Apply (ITA).',
  'Expression of Interest',
  'Keep your EOI up to date—if circumstances change (new job, higher qualification), update it immediately to maximize points.'
FROM public.visas v WHERE v.subclass_number = 'SMC'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 4,
  'Apply for residence within 4 months of ITA',
  E'Once you receive an Invitation to Apply, you have 4 months to submit your full residence application with all supporting documents.

This includes: Completed application forms, All identity documents, Full medical examinations (by panel physicians), Police certificates, Employment evidence, Qualifications (with IQA if applicable), English test results, Payment of fees.

Submit online via the Immigration NZ portal. Ensure all documents are clear, complete, and properly certified if required.',
  'Police Certificates',
  'Police certificates are required from every country you have lived in for 12+ months in the last 10 years. Request these early—they can take weeks to obtain.'
FROM public.visas v WHERE v.subclass_number = 'SMC'
ON CONFLICT DO NOTHING;

-- Tracker seed data for SMC
INSERT INTO public.tracker_entries (visa_id, user_type, submitted_date, decision_date, processing_days, outcome, country_from, notes, is_verified)
SELECT 
  v.id,
  'user',
  '2025-09-15',
  '2026-01-20',
  127,
  'approved',
  'India',
  'IT Project Manager with NZ job offer, 200 points',
  true
FROM public.visas v WHERE v.subclass_number = 'SMC'
UNION ALL
SELECT 
  v.id,
  'lawyer',
  '2025-08-01',
  '2025-12-15',
  136,
  'approved',
  'Philippines',
  'Software Developer, Auckland employer, 185 points',
  true
FROM public.visas v WHERE v.subclass_number = 'SMC'
UNION ALL
SELECT 
  v.id,
  'user',
  '2025-10-10',
  NULL,
  NULL,
  'pending',
  'South Africa',
  'Civil Engineer, 190 points, awaiting allocation',
  false
FROM public.visas v WHERE v.subclass_number = 'SMC'
UNION ALL
SELECT 
  v.id,
  'user',
  '2025-11-05',
  NULL,
  NULL,
  'pending',
  'UK',
  'Healthcare professional, 195 points',
  false
FROM public.visas v WHERE v.subclass_number = 'SMC';

-- =============================================================
-- Canada – Federal Skilled Trades Program (Express Entry)
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  'FST',
  'Federal Skilled Trades Program (Express Entry)',
  'Canada',
  'work',
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/skilled-trades.html',
  'Pathway for skilled tradespeople to gain Canadian permanent residence through Express Entry. Requires work experience in eligible skilled trades, language proficiency, and either a job offer or Canadian trades certification.',
  'CAD $1,365 (processing fee CAD $850 + right of permanent residence fee CAD $515). Biometrics: CAD $85.',
  true
)
ON CONFLICT (subclass_number) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  category = EXCLUDED.category,
  official_url = EXCLUDED.official_url,
  summary = EXCLUDED.summary,
  processing_fee_description = EXCLUDED.processing_fee_description,
  is_active = true,
  updated_at = now();

INSERT INTO public.visa_requirements (visa_id, requirements_json)
SELECT
  v.id,
  jsonb_build_object(
    'eligibility', jsonb_build_array(
      'Have at least 2 years of full-time work experience (or equivalent part-time) in a skilled trade within the 5 years before applying.',
      'Meet the job requirements for your skilled trade as set out in the National Occupational Classification (NOC), except for needing a certificate of qualification.',
      'Have a valid job offer of full-time employment for at least 1 year OR a certificate of qualification in your skilled trade issued by a Canadian authority.',
      'Score at least CLB 5 for speaking and listening, CLB 4 for reading and writing (English or French).',
      'Have no plan to live in Quebec (Quebec has its own skilled worker program).',
      'Be admissible to Canada (security, criminal, and medical checks).',
      'Eligible trades include: Industrial, electrical, construction, maintenance, equipment operation, agriculture, manufacturing, cooking, baking, butchery.'
    ),
    'documents', jsonb_build_object(
      'identity', jsonb_build_array('Valid passport', 'Birth certificate', 'Two passport-size photographs'),
      'language', jsonb_build_array('IELTS General Training or CELPIP-General test results', 'TEF Canada or TCF Canada results (French)'),
      'work_experience', jsonb_build_array('Reference letters from employers specifying trade duties and NOC code', 'Trade certificates or apprenticeship documents', 'Pay stubs or tax records'),
      'qualification', jsonb_build_array('Certificate of qualification from a Canadian province/territory (if not using job offer route)', 'Red Seal endorsement (if applicable)'),
      'job_offer', jsonb_build_array('LMIA-supported job offer OR LMIA-exempt job offer (e.g., employer-specific work permit holders)', 'Employment contract or detailed offer letter'),
      'police_medical', jsonb_build_array('Police certificates', 'Upfront medical examination by panel physician')
    ),
    'processing_times', jsonb_build_object(
      'summary', 'Most Express Entry applications processed within 6 months of receiving complete application. FST draws occur less frequently than FSW/CEC—check current Express Entry rounds.',
      'source', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html',
      'last_checked', '2026-02-18'
    ),
    'citations', jsonb_build_array(
      jsonb_build_object(
        'label', 'IRCC – Federal Skilled Trades Program',
        'url', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/skilled-trades.html',
        'accessed', '2026-02-18'
      ),
      jsonb_build_object(
        'label', 'IRCC – NOC 2021 skilled trades list',
        'url', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/skilled-trades/noc-groups.html',
        'accessed', '2026-02-18'
      )
    )
  )
FROM public.visas v
WHERE v.subclass_number = 'FST'
ON CONFLICT (visa_id) DO UPDATE SET
  requirements_json = EXCLUDED.requirements_json,
  updated_at = now();

-- Premium content for FST
INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1,
  'Verify your trade qualifies',
  E'Check the NOC 2021 list to confirm your trade qualifies. Eligible major groups: 72 (Technical trades), 73 (General trades), 82 (Supervisors), 83 (Natural resources), 92 (Processing/manufacturing supervisors), 93 (Central control operators), 6320 (Cooks/chefs), 62200 (Bakers).

Your experience must match the NOC description (lead statement, main duties). You need 2+ years within the last 5 years.',
  'NOC Verification',
  'Use the IRCC NOC Finder tool to verify your trade''s NOC code and ensure it falls under the eligible skilled trades list.'
FROM public.visas v WHERE v.subclass_number = 'FST'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2,
  'Get a job offer OR certificate of qualification',
  E'You need ONE of: (1) Valid job offer for at least 1 year of full-time work, OR (2) Certificate of qualification from a Canadian province/territory.

Job offer route: Must be LMIA-approved or LMIA-exempt (if you hold a valid work permit for that employer). The offer must specify the trade and be for continuous paid work.

Certificate route: Contact the regulatory body in the province/territory where you plan to work. They will assess your training and experience against Canadian standards. Some trades require exams.',
  'Certificate of Qualification',
  'The Red Seal endorsement (if your trade has it) allows you to work anywhere in Canada and counts toward the certificate requirement.'
FROM public.visas v WHERE v.subclass_number = 'FST'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 3,
  'Create Express Entry profile and wait for draw',
  E'Unlike FSW, FST does not use the points grid (67 points). Instead, you enter the Express Entry pool and compete based on CRS scores.

Minimum requirements: CLB 5 speaking/listening, CLB 4 reading/writing. However, higher scores improve your CRS ranking.

FST draws are less frequent than general draws. Monitor the rounds of invitations. If selected, you receive an ITA and have 60 days to submit your full application.',
  'Language Test Results',
  'Consider retaking language tests if you can improve your scores. Higher CLB levels significantly boost CRS scores for trades applicants.'
FROM public.visas v WHERE v.subclass_number = 'FST'
ON CONFLICT DO NOTHING;

-- Tracker seed data for FST
INSERT INTO public.tracker_entries (visa_id, user_type, submitted_date, decision_date, processing_days, outcome, country_from, notes, is_verified)
SELECT 
  v.id,
  'user',
  '2025-10-01',
  '2026-02-05',
  127,
  'approved',
  'Jamaica',
  'Electrician with Red Seal, CRS 412',
  true
FROM public.visas v WHERE v.subclass_number = 'FST'
UNION ALL
SELECT 
  v.id,
  'user',
  '2025-11-15',
  NULL,
  NULL,
  'pending',
  'Mexico',
  'Chef with Canadian job offer, awaiting ITA',
  false
FROM public.visas v WHERE v.subclass_number = 'FST';

-- =============================================================
-- UK – Family Visa (Spouse/Partner)
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  'UK-FAMILY',
  'Family Visa (Spouse/Partner)',
  'United Kingdom',
  'family',
  'https://www.gov.uk/uk-family-visa',
  'For partners and spouses of British citizens or settled persons to join or stay with their partner in the UK. Initial visa valid 2.5 years, extendable, leading to Indefinite Leave to Remain after 5 years.',
  '£1,846 (application fee from outside UK). £1,048 (fee if applying from inside UK). Immigration Health Surcharge: £1,035 per year (£2,587.50 for 2.5 years).',
  true
)
ON CONFLICT (subclass_number) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  category = EXCLUDED.category,
  official_url = EXCLUDED.official_url,
  summary = EXCLUDED.summary,
  processing_fee_description = EXCLUDED.processing_fee_description,
  is_active = true,
  updated_at = now();

INSERT INTO public.visa_requirements (visa_id, requirements_json)
SELECT
  v.id,
  jsonb_build_object(
    'eligibility', jsonb_build_array(
      'Your partner must be a British citizen, have settled status (ILR), or have pre-settled status (if from EU/EEA/Switzerland).',
      'You must be in a genuine and subsisting relationship (married, civil partnership, or lived together 2+ years).',
      'Meet the financial requirement: Minimum income threshold of £29,000 gross annual income (rising to £34,500 in 2026, £38,700 by 2027).',
      'Have adequate accommodation in the UK without recourse to public funds.',
      'Prove English language proficiency: CEFR Level A1 (speaking/listening) for initial application, A2 for extension.',
      'Be of good character (no serious criminal convictions).',
      'Intend to live together permanently in the UK.'
    ),
    'documents', jsonb_build_object(
      'relationship', jsonb_build_array('Marriage or civil partnership certificate (recognized in UK)', 'Evidence of cohabitation for 2+ years if unmarried (joint bills, tenancy, correspondence)', 'Photos and communication history', 'Travel documents showing visits to each other'),
      'financial', jsonb_build_array('Payslips and bank statements (6 months if employed, 12+ months if self-employed)', 'Employment contract or letter from employer', 'Tax returns/SA302 (if self-employed)', 'Savings statements (if relying on cash savings above £16,000)', 'Property rental income evidence (if applicable)'),
      'english', jsonb_build_array('Approved English test certificate (IELTS Life Skills A1 or equivalent)', 'Degree certificate taught in English (with ECCTIS confirmation)', 'Exemption evidence (if over 65, have disability, or from majority English-speaking country)'),
      'accommodation', jsonb_build_array('Tenancy agreement or mortgage statement', 'Property inspection report (if multiple occupants)', 'Letter from landlord confirming permission (if renting)'),
      'identity', jsonb_build_array('Valid passport', 'Previous passports (showing travel history)', 'TB test certificate (if from listed country)')
    ),
    'processing_times', jsonb_build_object(
      'summary', 'Standard processing: 12 weeks (3 months) for applications outside UK. Priority service (if available): 6 weeks for additional £500. Processing times vary by country and application complexity.',
      'source', 'https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk',
      'last_checked', '2026-02-18'
    ),
    'citations', jsonb_build_array(
      jsonb_build_object(
        'label', 'UK Gov – Family visas: apply, extend or switch',
        'url', 'https://www.gov.uk/uk-family-visa',
        'accessed', '2026-02-18'
      ),
      jsonb_build_object(
        'label', 'UK Gov – Financial requirement',
        'url', 'https://www.gov.uk/guidance/immigration-rules/appendix-fm-financial-requirement',
        'accessed', '2026-02-18'
      ),
      jsonb_build_object(
        'label', 'UK Gov – Knowledge of English',
        'url', 'https://www.gov.uk/guidance/immigration-rules/appendix-koll',
        'accessed', '2026-02-18'
      )
    )
  )
FROM public.visas v
WHERE v.subclass_number = 'UK-FAMILY'
ON CONFLICT (visa_id) DO UPDATE SET
  requirements_json = EXCLUDED.requirements_json,
  updated_at = now();

-- Premium content for UK Family
INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1,
  'Understand the financial requirement',
  E'The financial requirement is the #1 reason for refusal. Your UK partner must earn at least £29,000 gross annually from employment, self-employment, or specified other sources.

If your partner does not meet the threshold, you can combine incomes (if you are already in UK working lawfully). Cash savings above £16,000 can also substitute: formula is (savings - £16,000) ÷ 2.5 = equivalent annual income.

Note: The threshold is rising to £34,500 in 2026 and £38,700 by 2027. Plan accordingly if applying later.',
  'Financial Evidence',
  'Provide 6 months of payslips AND matching bank statements showing salary deposits. Self-employed need 1+ year of tax returns (SA302) and accountant letters.'
FROM public.visas v WHERE v.subclass_number = 'UK-FAMILY'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2,
  'Prove your relationship is genuine',
  E'Evidence of a genuine relationship is critical. If married/civil partnership: Provide certificate and evidence of cohabitation (if applicable).

If unmarried partners: You MUST prove 2+ years of living together akin to marriage. Evidence includes: Joint tenancy/mortgage, Utility bills in both names, Official correspondence to same address, Photos together with dates and locations, Travel records showing visits, Communication records (WhatsApp, calls).

Quality over quantity: 10-15 strong pieces of evidence beat 50 weak ones. Spread evidence across the full relationship timeline.',
  'Relationship Evidence',
  'Include a cover letter narrating your relationship story: how you met, when you decided to live together, key milestones, and future plans.'
FROM public.visas v WHERE v.subclass_number = 'UK-FAMILY'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 3,
  'Meet the English language requirement',
  E'You must pass an approved English test at CEFR Level A1 (speaking and listening only) for initial applications. For extension after 2.5 years, you need A2 level.

Approved tests: IELTS Life Skills A1/A2, Trinity College London GESE Grade 2/3. The test must be taken at an approved SELT centre.

Exemptions apply if: You are over 65, Have a physical/mental condition preventing test, Are a national of a majority English-speaking country (USA, Canada, Australia, NZ, etc.), OR hold a degree taught in English (with ECCTIS confirmation).',
  'English Test Certificate',
  'Book your test early—appointments fill up. The certificate is valid for 2 years. Keep the unique reference number (URN) safe; you will need it for the application.'
FROM public.visas v WHERE v.subclass_number = 'UK-FAMILY'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 4,
  'Complete online application and biometrics',
  E'Apply online at gov.uk. You will complete a lengthy form covering personal details, immigration history, relationship, finances, and English language.

After submitting and paying fees, you book a biometrics appointment at a Visa Application Centre (VAC). At the appointment: Provide fingerprints and photograph, Submit supporting documents (or upload if using the app), Pay for any optional services (priority processing, document scanning).

Timeline: Standard decisions take ~12 weeks. Priority service (where available) reduces to ~6 weeks for an additional £500.',
  'Biometric Appointment',
  'Bring your passport, appointment confirmation, and document checklist to the VAC. If uploading documents, do so before your appointment.'
FROM public.visas v WHERE v.subclass_number = 'UK-FAMILY'
ON CONFLICT DO NOTHING;

-- Tracker seed data for UK Family
INSERT INTO public.tracker_entries (visa_id, user_type, submitted_date, decision_date, processing_days, outcome, country_from, notes, is_verified)
SELECT 
  v.id,
  'user',
  '2025-09-20',
  '2025-12-15',
  86,
  'approved',
  'USA',
  'Spouse of British citizen, priority service used',
  true
FROM public.visas v WHERE v.subclass_number = 'UK-FAMILY'
UNION ALL
SELECT 
  v.id,
  'user',
  '2025-10-05',
  '2026-01-28',
  115,
  'approved',
  'India',
  'Unmarried partner, 3 years cohabitation evidence',
  true
FROM public.visas v WHERE v.subclass_number = 'UK-FAMILY'
UNION ALL
SELECT 
  v.id,
  'user',
  '2025-11-20',
  NULL,
  NULL,
  'pending',
  'Nigeria',
  'Standard service, biometrics completed',
  false
FROM public.visas v WHERE v.subclass_number = 'UK-FAMILY';
