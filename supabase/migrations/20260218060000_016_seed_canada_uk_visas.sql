/*
  # Seed Canada Express Entry (FSW, CEC) and UK Skilled Worker Visas

  Adds 3 international visas with official metadata, structured requirements, premium guides, and baseline tracker data.
  
  Sources referenced (accessed 18 Feb 2026):
    - IRCC – Federal Skilled Worker Program: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/federal-skilled-workers.html
    - IRCC – Canadian Experience Class: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/canadian-experience-class.html
    - UK Gov – Skilled Worker visa: https://www.gov.uk/skilled-worker-visa
    - IRCC – Processing times: https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html
    - UK Gov – Visa decision waiting times: https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk
*/

-- =============================================================
-- Canada – Federal Skilled Worker (Express Entry)
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  'FSW',
  'Federal Skilled Worker Program (Express Entry)',
  'Canada',
  'work',
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/federal-skilled-workers.html',
  'Canada''s flagship skilled immigration pathway under Express Entry. Points-based (Comprehensive Ranking System) for foreign nationals with skilled work experience. Leads to Canadian permanent residence.',
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
      'At least 1 year of continuous full-time (or equivalent part-time) skilled work experience in the last 10 years in a NOC TEER 0, 1, 2, or 3 occupation.',
      'Score at least 67 out of 100 on the FSW points grid (education, language, experience, age, arranged employment, adaptability).',
      'Prove language ability in English or French at CLB 7 or higher in all four abilities (speaking, listening, reading, writing).',
      'Have your foreign educational credentials assessed by a designated organization (ECA).',
      'Have enough settlement funds (unless you have a valid Canadian job offer).',
      'Be admissible to Canada (security, criminal, and medical checks).'
    ),
    'documents', jsonb_build_object(
      'identity', jsonb_build_array('Valid passport (all pages with stamps/visas)', 'Birth certificate', 'Two passport-size photographs meeting IRCC specifications'),
      'language', jsonb_build_array('IELTS General Training or CELPIP-General test results (English)', 'TEF Canada or TCF Canada results (French, if applicable)'),
      'education', jsonb_build_array('Educational Credential Assessment (ECA) report from a designated organization', 'Degree certificates and transcripts'),
      'work_experience', jsonb_build_array('Reference letters from each employer on official letterhead (duties, dates, hours)', 'Pay stubs or tax records confirming employment'),
      'settlement_funds', jsonb_build_array('Bank statements or investment records showing sufficient funds (LICO table)', 'Letter from financial institution confirming funds'),
      'police_medical', jsonb_build_array('Police clearance certificates from every country lived in 6+ months since age 18', 'Upfront medical examination by a panel physician')
    ),
    'processing_times', jsonb_build_object(
      'summary', 'IRCC aims to process most Express Entry applications within 6 months (180 days) of receiving a complete application. Category-based draws may affect processing.',
      'source', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html',
      'last_checked', '2026-02-18'
    ),
    'citations', jsonb_build_array(
      jsonb_build_object(
        'label', 'IRCC – Federal Skilled Worker: Eligibility',
        'url', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/federal-skilled-workers.html',
        'accessed', '2026-02-18'
      ),
      jsonb_build_object(
        'label', 'IRCC – Express Entry rounds of invitations',
        'url', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html',
        'accessed', '2026-02-18'
      )
    )
  )
FROM public.visas v
WHERE v.subclass_number = 'FSW'
ON CONFLICT (visa_id) DO UPDATE SET
  requirements_json = EXCLUDED.requirements_json,
  updated_at = now();

-- Premium content for FSW
INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1,
  'Create your Express Entry profile',
  E'Before anything else, create an account on the IRCC portal and fill out your Express Entry profile. You''ll need your language test results, Educational Credential Assessment (ECA), and work history details ready.\n\nYour profile enters the Express Entry pool and receives a Comprehensive Ranking System (CRS) score. The higher your score, the better your chances of receiving an Invitation to Apply (ITA) in a draw.\n\nTip: Complete your profile accurately—errors can lead to refusal or bans. Double-check NOC codes for your occupations.',
  'Language Test Results',
  'You need valid IELTS General Training or CELPIP results showing CLB 7+ in all abilities before submitting your profile.'
FROM public.visas v WHERE v.subclass_number = 'FSW'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2,
  'Get your Educational Credential Assessment (ECA)',
  E'An ECA confirms that your foreign degree or diploma is valid and equivalent to a Canadian credential. You must use a designated organization such as WES, IQAS, or the University of Toronto.\n\nProcessing times vary: WES typically takes 5-15 business days after receiving documents, while others may take longer. Start this process early—it can be the longest wait.\n\nEnsure your institution sends transcripts directly to the assessing body, as self-submitted copies are not accepted by most organizations.',
  'Educational Credential Assessment',
  'Your ECA report must be less than 5 years old at the time of your Express Entry profile submission.'
FROM public.visas v WHERE v.subclass_number = 'FSW'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 3,
  'Receive invitation and submit full application',
  E'Once you receive an ITA, you have 60 days to submit a complete application. This is where preparation pays off—gather all supporting documents before the clock starts.\n\nYour application includes identity documents, police clearances from every country you''ve lived in for 6+ months since age 18, medical exam results from an IRCC-designated panel physician, and proof of settlement funds.\n\nSettlement funds must meet the Low Income Cut-Off (LICO) threshold: CAD $14,690 for a single applicant, scaling up per family member (2025 figures). Funds in a job offer scenario may be exempt.\n\nAfter submission, IRCC may request additional documents or an interview. Respond promptly to any requests.',
  'Police Clearances & Medical',
  'Request police certificates early—some countries take months. Book your medical with a panel physician listed on the IRCC website.'
FROM public.visas v WHERE v.subclass_number = 'FSW'
ON CONFLICT DO NOTHING;

-- Tracker seed data for FSW
INSERT INTO public.tracker_entries (visa_id, application_date, decision_date, processing_days, outcome, weight, submitter_role)
SELECT v.id, d.app_date::date, d.dec_date::date, d.days, d.outcome::tracker_outcome, d.weight, NULL
FROM public.visas v,
(VALUES
  ('2025-05-10', '2025-10-28', 171, 'approved', 1),
  ('2025-06-15', '2025-12-10', 178, 'approved', 1),
  ('2025-07-01', '2026-01-05', 188, 'approved', 1),
  ('2025-04-20', '2025-10-01', 164, 'approved', 1),
  ('2025-08-10', '2026-02-01', 175, 'refused', 1)
) AS d(app_date, dec_date, days, outcome, weight)
WHERE v.subclass_number = 'FSW'
ON CONFLICT DO NOTHING;


-- =============================================================
-- Canada – Canadian Experience Class (Express Entry)
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  'CEC',
  'Canadian Experience Class (Express Entry)',
  'Canada',
  'work',
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/canadian-experience-class.html',
  'For skilled workers with Canadian work experience. Part of Express Entry. Ideal for international graduates or temporary foreign workers already in Canada who want permanent residence.',
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
      'At least 1 year of skilled work experience in Canada within the last 3 years (NOC TEER 0, 1, 2, or 3).',
      'Work experience must have been gained with proper authorization (valid work permit).',
      'Meet minimum language requirements: CLB 7 for NOC TEER 0 or 1; CLB 5 for NOC TEER 2 or 3.',
      'Be admissible to Canada and intend to live outside Quebec.',
      'No education requirement, but education improves CRS score.'
    ),
    'documents', jsonb_build_object(
      'identity', jsonb_build_array('Valid passport', 'Birth certificate', 'Photographs meeting IRCC specs'),
      'language', jsonb_build_array('IELTS General Training or CELPIP results (English)', 'TEF or TCF results (French, if claiming)'),
      'canadian_experience', jsonb_build_array('Reference letters from Canadian employers (duties, hours, dates, NOC code)', 'T4 tax slips or CRA Notice of Assessment', 'Work permits showing authorization during claimed period'),
      'police_medical', jsonb_build_array('Police certificates from all countries of residence (6+ months)', 'Medical exam by IRCC panel physician')
    ),
    'processing_times', jsonb_build_object(
      'summary', 'Most CEC applications processed within 6 months of receiving a complete application, consistent with the Express Entry service standard.',
      'source', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html',
      'last_checked', '2026-02-18'
    ),
    'citations', jsonb_build_array(
      jsonb_build_object(
        'label', 'IRCC – Canadian Experience Class: Eligibility',
        'url', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/canadian-experience-class.html',
        'accessed', '2026-02-18'
      )
    )
  )
FROM public.visas v
WHERE v.subclass_number = 'CEC'
ON CONFLICT (visa_id) DO UPDATE SET
  requirements_json = EXCLUDED.requirements_json,
  updated_at = now();

-- Premium content for CEC
INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1,
  'Verify your Canadian work experience qualifies',
  E'Before creating your Express Entry profile, confirm your Canadian work experience meets CEC requirements. Your work must be in a NOC TEER 0, 1, 2, or 3 occupation, performed under a valid work permit, and total at least 12 months within the last 3 years.\n\nSelf-employment and work while being a full-time student generally does not count. Co-op work terms may count if they were part of a work permit.\n\nUse the NOC finder tool on Canada.ca to confirm your occupation classification. The NOC code on your reference letter should match.',
  'Canadian Employment Records',
  'Gather T4 slips, pay stubs, and employment reference letters on company letterhead specifying your NOC duties.'
FROM public.visas v WHERE v.subclass_number = 'CEC'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2,
  'Take your language test and submit your profile',
  E'CEC requires CLB 7 for TEER 0/1 occupations and CLB 5 for TEER 2/3. Book IELTS General Training or CELPIP early—test dates fill up fast.\n\nOnce you have results, create your Express Entry profile on the IRCC portal. Your CRS score will include factors like age, education, language, Canadian work experience, and additional points (provincial nomination, job offer, French ability).\n\nThe higher your CRS, the sooner you''ll receive an ITA. Check recent draw scores on Canada.ca to gauge your competitiveness.',
  'Language Test Results',
  'Ensure your test results are less than 2 years old when you submit your profile.'
FROM public.visas v WHERE v.subclass_number = 'CEC'
ON CONFLICT DO NOTHING;

-- Tracker seed data for CEC
INSERT INTO public.tracker_entries (visa_id, application_date, decision_date, processing_days, outcome, weight, submitter_role)
SELECT v.id, d.app_date::date, d.dec_date::date, d.days, d.outcome::tracker_outcome, d.weight, NULL
FROM public.visas v,
(VALUES
  ('2025-06-01', '2025-11-15', 167, 'approved', 1),
  ('2025-07-10', '2025-12-20', 163, 'approved', 1),
  ('2025-05-05', '2025-10-20', 168, 'approved', 1),
  ('2025-08-01', '2026-01-15', 167, 'refused', 1)
) AS d(app_date, dec_date, days, outcome, weight)
WHERE v.subclass_number = 'CEC'
ON CONFLICT DO NOTHING;


-- =============================================================
-- UK – Skilled Worker Visa
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  'SW-UK',
  'Skilled Worker Visa',
  'United Kingdom',
  'work',
  'https://www.gov.uk/skilled-worker-visa',
  'The UK''s main work visa route. Requires a job offer from a licensed sponsor in an eligible skilled occupation. Leads to settlement (Indefinite Leave to Remain) after 5 years. Replaced the former Tier 2 (General) route.',
  'GBP £719 (up to 3 years) or GBP £1,420 (over 3 years). Immigration Health Surcharge: GBP £1,035/year. Reduced fees for shortage occupations.',
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
      'Have a confirmed job offer from a UK employer with a valid sponsor licence.',
      'The job must be in an eligible skilled occupation at RQF Level 3 or above (SOC 2020 codes).',
      'Meet the minimum salary threshold: generally £38,700/year or the going rate for the occupation, whichever is higher. Reduced thresholds apply for new entrants, shortage occupations, PhD-level roles, and certain health/education roles.',
      'Prove English language ability at CEFR B1 level (speaking, listening, reading, writing) via approved test, nationality, or degree taught in English.',
      'Have enough personal savings to support yourself (at least £1,270 in your bank account for 28 consecutive days, unless your sponsor certifies maintenance).',
      'Provide a valid TB test certificate if applying from a listed country.'
    ),
    'documents', jsonb_build_object(
      'identity', jsonb_build_array('Valid passport or travel document', 'Biometric information (given at visa application centre)'),
      'job_offer', jsonb_build_array('Certificate of Sponsorship (CoS) reference number from employer', 'Evidence of job title, SOC code, salary, and start date'),
      'english_language', jsonb_build_array('Approved English language test certificate (IELTS for UKVI, PTE Academic, etc.)', 'Or proof of English-taught degree (ECCTIS/Naric statement)'),
      'financial', jsonb_build_array('Bank statements showing £1,270 held for 28 consecutive days (unless sponsor certifies)', 'Letter from bank confirming funds (if applicable)'),
      'criminal_record', jsonb_build_array('Criminal record certificate from any country lived in 12+ months in the last 10 years (if applicable)', 'ACRO certificate for UK residents'),
      'tuberculosis', jsonb_build_array('TB test certificate from approved clinic if applying from a listed country')
    ),
    'processing_times', jsonb_build_object(
      'summary', 'Standard processing: decision within 3 weeks of biometrics appointment (outside UK) or 8 weeks (inside UK). Priority services available for additional fees.',
      'source', 'https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk',
      'last_checked', '2026-02-18'
    ),
    'citations', jsonb_build_array(
      jsonb_build_object(
        'label', 'UK Gov – Skilled Worker visa overview',
        'url', 'https://www.gov.uk/skilled-worker-visa',
        'accessed', '2026-02-18'
      ),
      jsonb_build_object(
        'label', 'UK Gov – Skilled Worker visa: Eligibility',
        'url', 'https://www.gov.uk/skilled-worker-visa/eligibility',
        'accessed', '2026-02-18'
      ),
      jsonb_build_object(
        'label', 'UK Gov – Immigration salary list (shortage occupations)',
        'url', 'https://www.gov.uk/government/publications/skilled-worker-visa-immigration-salary-list',
        'accessed', '2026-02-18'
      )
    )
  )
FROM public.visas v
WHERE v.subclass_number = 'SW-UK'
ON CONFLICT (visa_id) DO UPDATE SET
  requirements_json = EXCLUDED.requirements_json,
  updated_at = now();

-- Premium content for UK Skilled Worker
INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1,
  'Secure a job offer from a licensed UK sponsor',
  E'The Skilled Worker visa requires a genuine job offer from an employer with a valid UK sponsor licence. You can search for licensed sponsors on the UK Government''s register of sponsors.\n\nYour employer must assign you a Certificate of Sponsorship (CoS), which contains a unique reference number, your job title, SOC code, and salary details. This is not a physical document—it''s an electronic record.\n\nEnsure the job meets the minimum skill level (RQF 3+) and salary threshold. For most roles this is £38,700 or the occupation going rate, whichever is higher. New entrants (under 26, switching from student visa, etc.) may qualify for a reduced threshold of £30,960.',
  'Certificate of Sponsorship',
  'Your employer issues this electronically. You will need the CoS reference number for your application. Confirm the details (job title, salary, SOC code) are accurate before applying.'
FROM public.visas v WHERE v.subclass_number = 'SW-UK'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2,
  'Prove your English and gather documents',
  E'You must prove English at CEFR B1 level. Options include:\n• Approved test: IELTS for UKVI (min 4.0 in each skill), PTE Academic, Trinity ISE, or LanguageCert.\n• Nationality: Citizens of majority English-speaking countries are exempt.\n• Academic qualification: A degree taught in English, verified by Ecctis (formerly NARIC).\n\nOther documents to prepare:\n• Valid passport with at least one blank page.\n• TB test certificate if applying from a listed country (see UK Gov TB test list).\n• Bank statements showing £1,270 for 28 consecutive days ending no more than 31 days before your application. Your sponsor can certify maintenance instead.\n• Criminal record certificates from countries where you lived 12+ months.',
  'English Language & Identity',
  'Book your IELTS/PTE test early. If using a degree, apply for an Ecctis statement well in advance as processing takes 15+ business days.'
FROM public.visas v WHERE v.subclass_number = 'SW-UK'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 3,
  'Submit your application and attend biometrics',
  E'Apply online at gov.uk/skilled-worker-visa. You will need:\n• Your CoS reference number\n• Passport details\n• Answers about your travel history, criminal record, and health\n\nAfter submitting, book a biometrics appointment at your nearest visa application centre (VAC). You''ll provide fingerprints and a photograph.\n\nStandard processing: decision within 3 weeks of biometrics. Priority (5 working days) and Super Priority (next working day) services available for additional fees at selected locations.\n\nOnce approved, you''ll receive a vignette in your passport (if outside UK) valid for 90 days, and must collect your Biometric Residence Permit (BRP) within 10 days of arrival.',
  'Application Submission',
  'Pay the application fee (£719 for up to 3 years), plus the Immigration Health Surcharge (£1,035/year). Keep your IHS reference number—you need it to complete the application.'
FROM public.visas v WHERE v.subclass_number = 'SW-UK'
ON CONFLICT DO NOTHING;

-- Tracker seed data for UK Skilled Worker
INSERT INTO public.tracker_entries (visa_id, application_date, decision_date, processing_days, outcome, weight, submitter_role)
SELECT v.id, d.app_date::date, d.dec_date::date, d.days, d.outcome::tracker_outcome, d.weight, NULL
FROM public.visas v,
(VALUES
  ('2025-09-01', '2025-09-20', 19, 'approved', 1),
  ('2025-10-05', '2025-10-25', 20, 'approved', 1),
  ('2025-11-10', '2025-12-03', 23, 'approved', 1),
  ('2025-08-15', '2025-09-08', 24, 'approved', 1),
  ('2025-12-01', '2025-12-22', 21, 'refused', 1)
) AS d(app_date, dec_date, days, outcome, weight)
WHERE v.subclass_number = 'SW-UK'
ON CONFLICT DO NOTHING;


-- =============================================================
-- Refresh tracker_stats materialized view for new visas
-- =============================================================
REFRESH MATERIALIZED VIEW IF EXISTS public.tracker_stats;
