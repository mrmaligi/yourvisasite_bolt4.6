/*
  # Expand Australian Visa Data Part 2 (494, 186, 500, 600)

  Continues migration 014 with 4 additional high-demand Australian visas.

  Sources referenced (accessed 18 Feb 2026):
    - https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494
    - https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186
    - https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500
    - https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600
*/

-- =============================================================
-- Skilled Employer Sponsored Regional (Provisional) visa (subclass 494)
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  '494',
  'Skilled Employer Sponsored Regional (Provisional) visa (subclass 494)',
  'Australia',
  'work',
  'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494',
  'Allows skilled workers to live and work in regional Australia for an approved employer. Valid for 5 years with a direct pathway to permanent residence (subclass 191) after 3 years.',
  'Primary applicant base charge: AUD 4,640 (Department of Home Affairs fee schedule, 1 July 2025).',
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
      'Be nominated by an employer in regional Australia with approved Standard Business Sponsor status.',
      'Work in occupation on relevant skilled occupation list for regional employers.',
      'Have at least 3 years of relevant full-time work experience.',
      'Hold positive skills assessment (unless exempt).',
      'Be under 45 years of age (exemptions apply).',
      'Meet English language requirement.',
      'Work only for nominating employer in regional location for 3 years.'
    ),
    'documents', jsonb_build_object(
      'employer_nomination', jsonb_build_array('Approved Standard Business Sponsor evidence', 'Nomination approval', 'Employment contract'),
      'identity', jsonb_build_array('Passport', 'Birth certificate', 'Marriage certificate'),
      'skills_experience', jsonb_build_array('Skills assessment', '3 years employment references', 'Payslips and tax evidence'),
      'compliance', jsonb_build_array('English test results', 'Health examinations', 'Police clearances', 'Professional licenses')
    ),
    'processing_times', jsonb_build_object(
      'summary', 'Processing varies: nominations vary; visa applications typically 4–12 months depending on occupation risk rating.',
      'source', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times',
      'last_checked', '2026-02-18'
    ),
    'citations', jsonb_build_array(
      jsonb_build_object(
        'label', 'Department of Home Affairs – Subclass 494',
        'url', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494',
        'accessed', '2026-02-18'
      )
    )
  )
FROM public.visas v
WHERE v.subclass_number = '494'
ON CONFLICT (visa_id) DO UPDATE SET
  requirements_json = EXCLUDED.requirements_json,
  updated_at = now();

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1, 'Secure regional employer sponsorship', 
  E'• Confirm employer SBS status and regional location.
• Verify occupation is on eligible list.
• Review employment contract meets TSMIT and market rates.',
  'Employer Documents', 'Keep nomination approval and employment contract together.'
FROM public.visas v WHERE v.subclass_number = '494'
ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2, 'Prepare skills assessment', 
  E'• Obtain assessment from relevant authority.
• Compile 3 years detailed employment references.
• Gather payslips and tax records.',
  'Skills Documents', 'Skills assessment is critical—upload early.'
FROM public.visas v WHERE v.subclass_number = '494'
ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 3, 'Transition to PR (subclass 191)', 
  E'• After 3 years on 494, apply for PR.
• Maintain records of employment and residence.
• Meet income threshold for 3 years.',
  'Identity Documents', 'Keep employment and residence records organized.'
FROM public.visas v WHERE v.subclass_number = '494'
ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.products (visa_id, price_cents, is_active)
SELECT v.id, 4900, true FROM public.visas v WHERE v.subclass_number = '494'
ON CONFLICT (visa_id) DO UPDATE SET price_cents = EXCLUDED.price_cents, is_active = true;

INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, outcome)
SELECT v.id, NULL, 'user'::public.user_role, '2024-03-20'::date, '2024-11-15'::date, 'approved'
FROM public.visas v WHERE v.subclass_number = '494' AND NOT EXISTS (SELECT 1 FROM public.tracker_entries te WHERE te.visa_id = v.id AND te.application_date = '2024-03-20'::date);

-- =============================================================
-- Employer Nomination Scheme (subclass 186)
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  '186',
  'Employer Nomination Scheme (subclass 186)',
  'Australia',
  'work',
  'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186',
  'Permanent residence for skilled workers nominated by an Australian employer. Three streams: Direct Entry, Temporary Residence Transition, and Labour Agreement.',
  'Primary applicant base charge: AUD 4,640 (Department of Home Affairs fee schedule, 1 July 2025).',
  true
)
ON CONFLICT (subclass_number) DO UPDATE SET
  name = EXCLUDED.name, country = EXCLUDED.country, category = EXCLUDED.category,
  official_url = EXCLUDED.official_url, summary = EXCLUDED.summary,
  processing_fee_description = EXCLUDED.processing_fee_description, is_active = true, updated_at = now();

INSERT INTO public.visa_requirements (visa_id, requirements_json)
SELECT v.id, jsonb_build_object(
  'eligibility', jsonb_build_array(
    'Be nominated by Australian employer with SBS status.',
    'Occupation on relevant skilled occupation list.',
    'Skills assessment (Direct Entry) OR 2-3 years on 482 (TRT).',
    'Under 45 (exemptions apply).',
    'Meet English requirement.',
    'Meet health and character requirements.'
  ),
  'documents', jsonb_build_object(
    'nomination', jsonb_build_array('Employer nomination approval', 'SBS evidence'),
    'identity', jsonb_build_array('Passport', 'Birth certificate'),
    'skills', jsonb_build_array('Skills assessment (Direct Entry)', 'Employment evidence'),
    'compliance', jsonb_build_array('English results', 'Health exams', 'Police certificates')
  ),
  'processing_times', jsonb_build_object(
    'summary', 'Direct Entry: 4–12 months; TRT stream often faster.',
    'source', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times',
    'last_checked', '2026-02-18'
  ),
  'citations', jsonb_build_array(jsonb_build_object('label', 'Department of Home Affairs – Subclass 186', 'url', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186', 'accessed', '2026-02-18'))
) FROM public.visas v WHERE v.subclass_number = '186'
ON CONFLICT (visa_id) DO UPDATE SET requirements_json = EXCLUDED.requirements_json;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1, 'Choose your 186 stream', E'• Direct Entry: 3+ years experience + skills assessment.
• TRT Stream: Already on 482 with same employer.
• Verify employer SBS status before proceeding.', 'Nomination Documents', 'Get written confirmation of stream from employer.'
FROM public.visas v WHERE v.subclass_number = '186' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2, 'Skills assessment for Direct Entry', E'• Identify correct assessing authority.
• Prepare detailed employment references.
• Submit assessment early (2-4 months processing).', 'Skills Documents', 'Skills assessment is most critical for Direct Entry.'
FROM public.visas v WHERE v.subclass_number = '186' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 3, 'Post-grant: Permanent resident rights', E'• Apply for Medicare immediately.
• Consider citizenship pathway after 4 years (1 year as PR).
• Enjoy unrestricted work and study rights.', 'Compliance Documents', 'Upload Form 80 proactively for faster processing.'
FROM public.visas v WHERE v.subclass_number = '186' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.products (visa_id, price_cents, is_active)
SELECT v.id, 4900, true FROM public.visas v WHERE v.subclass_number = '186' ON CONFLICT (visa_id) DO UPDATE SET price_cents = EXCLUDED.price_cents, is_active = true;

INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, outcome)
SELECT v.id, NULL, 'user'::public.user_role, '2024-01-08'::date, '2024-09-15'::date, 'approved'
FROM public.visas v WHERE v.subclass_number = '186' AND NOT EXISTS (SELECT 1 FROM public.tracker_entries te WHERE te.visa_id = v.id AND te.application_date = '2024-01-08'::date);

-- =============================================================
-- Student visa (subclass 500)
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  '500',
  'Student visa (subclass 500)',
  'Australia',
  'study',
  'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
  'Allows international students to study full-time at registered Australian institutions. Includes work rights (48 hours/fortnight during terms) and pathways to post-study work visas.',
  'Primary applicant base charge: AUD 1,600 (Department of Home Affairs fee schedule, 1 July 2025).',
  true
)
ON CONFLICT (subclass_number) DO UPDATE SET
  name = EXCLUDED.name, country = EXCLUDED.country, category = EXCLUDED.category,
  official_url = EXCLUDED.official_url, summary = EXCLUDED.summary,
  processing_fee_description = EXCLUDED.processing_fee_description, is_active = true, updated_at = now();

INSERT INTO public.visa_requirements (visa_id, requirements_json)
SELECT v.id, jsonb_build_object(
  'eligibility', jsonb_build_array(
    'Enrolled in registered full-time course.',
    'Hold OSHC for entire stay.',
    'Meet Genuine Temporary Entrant (GTE) requirement.',
    'Demonstrate sufficient funds.',
    'Meet English language requirements.',
    'Meet health and character requirements.'
  ),
  'documents', jsonb_build_object(
    'enrolment', jsonb_build_array('Confirmation of Enrolment (CoE)', 'Course details and CRICOS code'),
    'identity', jsonb_build_array('Passport', 'Birth certificate'),
    'financial', jsonb_build_array('Bank statements', 'Scholarship letters', 'Financial sponsor declaration'),
    'health_insurance', jsonb_build_array('OSHC policy certificate'),
    'gte', jsonb_build_array('GTE statement', 'Evidence of ties to home country'),
    'compliance', jsonb_build_array('English test results', 'Health exams', 'Police certificates', 'Academic transcripts')
  ),
  'processing_times', jsonb_build_object(
    'summary', 'Higher Education: 1–4 months; VET: 3–8 months; varies by passport country.',
    'source', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times',
    'last_checked', '2026-02-18'
  ),
  'citations', jsonb_build_array(jsonb_build_object('label', 'Department of Home Affairs – Subclass 500', 'url', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', 'accessed', '2026-02-18'))
) FROM public.visas v WHERE v.subclass_number = '500'
ON CONFLICT (visa_id) DO UPDATE SET requirements_json = EXCLUDED.requirements_json;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1, 'Secure your CoE and choose OSHC', E'• Accept offer and receive CoE from registered provider.
• Purchase OSHC (Allianz, Bupa, Medibank, NIB, or AHM).
• OSHC must cover entire course duration plus 2+ months.', 'Health Insurance', 'Upload OSHC certificate with CoE in initial application.'
FROM public.visas v WHERE v.subclass_number = '500' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2, 'Write a strong GTE statement', E'• Explain why you chose this course and institution.
• Demonstrate ties to home country (family, property, employment).
• Outline career goals showing course relevance.
• Avoid statements suggesting immigration intent.', 'GTE Documents', 'GTE statement is heavily weighted—be specific and genuine.'
FROM public.visas v WHERE v.subclass_number = '500' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 3, 'Prove financial capacity', E'• Show funds for tuition + living costs + travel.
• Living cost requirement: ~AUD 24,505/year (2025 rate).
• Acceptable evidence: bank statements, loan letters, scholarships, sponsor documents.', 'Financial Documents', 'Bank statements should show consistent balance for 3+ months.'
FROM public.visas v WHERE v.subclass_number = '500' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 4, 'Post-arrival compliance', E'• Maintain enrollment and satisfactory course progress.
• Work maximum 48 hours per fortnight during terms.
• Keep OSHC current—renew before expiry.
• Notify provider of address changes within 7 days.', 'Compliance Documents', 'Keep enrollment and work records in case of compliance check.'
FROM public.visas v WHERE v.subclass_number = '500' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.products (visa_id, price_cents, is_active)
SELECT v.id, 2900, true FROM public.visas v WHERE v.subclass_number = '500' ON CONFLICT (visa_id) DO UPDATE SET price_cents = EXCLUDED.price_cents, is_active = true;

INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, outcome)
SELECT v.id, NULL, 'user'::public.user_role, '2024-06-01'::date, '2024-08-15'::date, 'approved'
FROM public.visas v WHERE v.subclass_number = '500' AND NOT EXISTS (SELECT 1 FROM public.tracker_entries te WHERE te.visa_id = v.id AND te.application_date = '2024-06-01'::date);

-- =============================================================
-- Visitor visa (subclass 600)
-- =============================================================
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  '600',
  'Visitor visa (subclass 600)',
  'Australia',
  'visitor',
  'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600',
  'For people visiting Australia for tourism, business, or to visit family. Available as Tourist stream, Business Visitor stream, Sponsored Family stream, and Approved Destination Status stream.',
  'Primary applicant base charge: AUD 190 (Department of Home Affairs fee schedule, 1 July 2025).',
  true
)
ON CONFLICT (subclass_number) DO UPDATE SET
  name = EXCLUDED.name, country = EXCLUDED.country, category = EXCLUDED.category,
  official_url = EXCLUDED.official_url, summary = EXCLUDED.summary,
  processing_fee_description = EXCLUDED.processing_fee_description, is_active = true, updated_at = now();

INSERT INTO public.visa_requirements (visa_id, requirements_json)
SELECT v.id, jsonb_build_object(
  'eligibility', jsonb_build_array(
    'Genuine intention to visit temporarily (tourism, business, or family visit).',
    'Have enough funds for stay.',
    'Meet health and character requirements.',
    'Intend to return home after visit (strong home ties).',
    'Not have work restriction condition (8503) if applicable.'
  ),
  'documents', jsonb_build_object(
    'identity', jsonb_build_array('Passport', 'National ID', 'Birth certificate'),
    'financial', jsonb_build_array('Bank statements (3-6 months)', 'Pay slips', 'Tax returns', 'Employment letter'),
    'travel_itinerary', jsonb_build_array('Flight bookings (optional but helpful)', 'Accommodation bookings', 'Tour bookings'),
    'home_ties', jsonb_build_array('Employment contract', 'Property ownership/lease', 'Family ties evidence', 'Enrollment certificate if student'),
    'invitation', jsonb_build_array('Invitation letter from Australian host', 'Host passport/PR evidence', 'Host financial support letter if applicable'),
    'business', jsonb_build_array('Business registration', 'Conference invitation', 'Meeting schedules')
  ),
  'processing_times', jsonb_build_object(
    'summary', 'Tourist stream: typically 1–4 weeks for low-risk countries; 1–3 months for higher-risk passports. Business stream often faster.',
    'source', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times',
    'last_checked', '2026-02-18'
  ),
  'citations', jsonb_build_array(jsonb_build_object('label', 'Department of Home Affairs – Subclass 600', 'url', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600', 'accessed', '2026-02-18'))
) FROM public.visas v WHERE v.subclass_number = '600'
ON CONFLICT (visa_id) DO UPDATE SET requirements_json = EXCLUDED.requirements_json;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 1, 'Choose the right stream', E'• **Tourist Stream:** For holidays, sightseeing, visiting friends.
• **Business Visitor:** For conferences, meetings, business negotiations (no work rights).
• **Sponsored Family:** If Australian citizen/PR family member sponsors you (may include 8503 condition).
• **Approved Destination Status:** For tourists from specific countries on organized tours.', 'Identity Documents', 'Select correct stream—wrong stream selection causes delays.'
FROM public.visas v WHERE v.subclass_number = '600' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 2, 'Demonstrate strong home ties', E'• Employment: Provide contract, leave approval, letter confirming return to job.
• Financial: Show stable income, savings, assets in home country.
• Family: Document immediate family remaining in home country.
• Property: Ownership certificates, rental agreements showing ongoing commitments.', 'Home Ties Documents', 'Home ties evidence is the #1 factor in visitor visa decisions—be comprehensive.'
FROM public.visas v WHERE v.subclass_number = '600' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 3, 'Prepare visit documentation', E'• Draft a clear itinerary with dates, places, activities.
• If visiting family: invitation letter + host ID + proof of relationship.
• If business: conference registration, meeting invitations, company letter.
• Show sufficient funds: bank statements for 3-6 months.', 'Travel Documents', 'Organized itinerary and financial evidence significantly improve approval chances.'
FROM public.visas v WHERE v.subclass_number = '600' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT v.id, 4, 'Understand visa conditions', E'• **8101:** No work (standard for Tourist stream).
• **8503:** No further stay (common for Sponsored Family stream).
• **8201:** Maximum 3 months study.
• Comply with all conditions—breaches affect future applications.', 'Compliance Documents', 'Read grant notification carefully—conditions vary by stream and case officer discretion.'
FROM public.visas v WHERE v.subclass_number = '600' ON CONFLICT (visa_id, step_number) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

INSERT INTO public.products (visa_id, price_cents, is_active)
SELECT v.id, 1900, true FROM public.visas v WHERE v.subclass_number = '600' ON CONFLICT (visa_id) DO UPDATE SET price_cents = EXCLUDED.price_cents, is_active = true;

INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, outcome)
SELECT v.id, NULL, 'user'::public.user_role, '2025-01-10'::date, '2025-01-25'::date, 'approved'
FROM public.visas v WHERE v.subclass_number = '600' AND NOT EXISTS (SELECT 1 FROM public.tracker_entries te WHERE te.visa_id = v.id AND te.application_date = '2025-01-10'::date);
