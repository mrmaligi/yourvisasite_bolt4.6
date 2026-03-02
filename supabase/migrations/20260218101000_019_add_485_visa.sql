-- Migration 019: Temporary Graduate Visa (Subclass 485) and Additional Data
-- Sources: immi.homeaffairs.gov.au (as of Feb 2026)

-- Insert Temporary Graduate visa (485)
INSERT INTO public.visas (subclass_number, name, country, category, official_url, summary, processing_fee_description, is_active)
VALUES (
  '485',
  'Temporary Graduate',
  'Australia',
  'work',
  'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485',
  'A temporary visa that allows international students to live, study and work in Australia after finishing their studies. Available in multiple streams based on qualification level.',
  'From AUD 1,945 (base application charge)',
  true
)
ON CONFLICT (subclass_number) DO UPDATE SET
  name = EXCLUDED.name,
  summary = EXCLUDED.summary,
  processing_fee_description = EXCLUDED.processing_fee_description,
  updated_at = now();

-- Get the visa ID
DO $$
DECLARE
  v_visa_id uuid;
BEGIN
  SELECT id INTO v_visa_id FROM public.visas WHERE subclass_number = '485';

  -- Insert visa requirements (JSON structure)
  INSERT INTO public.visa_requirements (visa_id, requirements_json)
  VALUES (v_visa_id, '{
    "age": {
      "title": "Age Requirement",
      "description": "Must be under 50 years of age at time of application"
    },
    "english": {
      "title": "English Language",
      "description": "Competent English required (IELTS 6.0+ overall, or equivalent)"
    },
    "health": {
      "title": "Health",
      "description": "Must meet health requirements - medical examination may be required"
    },
    "character": {
      "title": "Character",
      "description": "Must meet character requirements - police certificates may be required"
    },
    "insurance": {
      "title": "Health Insurance",
      "description": "Must maintain adequate health insurance for entire stay in Australia"
    },
    "study_requirement": {
      "title": "Australian Study Requirement",
      "description": "Must have held student visa and completed eligible qualification within last 6 months"
    },
    "streams": {
      "title": "Available Streams",
      "description": "Post-Higher Education Work (Bachelor+), Post-Vocational Education Work (Diploma/Trade), Second Post-Higher Education Work (regional study)"
    }
  }'::jsonb)
  ON CONFLICT (visa_id) DO UPDATE SET
    requirements_json = EXCLUDED.requirements_json,
    updated_at = now();

  -- Insert premium content (step-by-step guide)
  INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
  VALUES
    (v_visa_id, 1, 'Determine Your Stream', 
     'The 485 visa has multiple streams based on your qualification level:\n\n**Post-Higher Education Work Stream**\n- For Bachelor, Masters, or Doctoral degree graduates\n- No occupation list restriction\n- Valid for 2-4 years depending on qualification\n\n**Post-Vocational Education Work Stream**\n- For Diploma, Advanced Diploma, or Trade qualification graduates\n- Must nominate an occupation on the Medium and Long-term Strategic Skills List (MLTSSL)\n- Skills assessment required\n- Valid for up to 18 months\n\n**Second Post-Higher Education Work Stream**\n- For graduates who studied at a regional campus\n- Additional 1-2 years beyond initial 485\n- Must have held first 485 and lived in regional area',
     'Identity Documents', 'Current passport and previous passports showing study period'),
    
    (v_visa_id, 2, 'Complete Your Studies',
     'You must have completed your qualification while holding a valid student visa. Key requirements:\n\n- Course must be CRICOS-registered\n- Minimum 92 weeks of study (2 academic years)\n- Must have been physically in Australia for at least 16 months\n- Completion date is when results are available, not ceremony date\n\n**Important:** You must apply within 6 months of course completion.',
     'Academic Documents', 'Completion letter, official transcripts, CRICOS course code confirmation'),
    
    (v_visa_id, 3, 'Skills Assessment (If Required)',
     'For Post-Vocational Education Work stream only:\n\n- Skills assessment must be lodged before or with visa application\n- Assessment conducted by relevant assessing authority for your occupation\n- Processing times vary by occupation (4-12 weeks typical)\n\nCommon assessing authorities include:\n- VETASSESS (general occupations)\n- TRA (trades)\n- ANMAC (nursing)\n- Engineers Australia (engineering)',
     'Skills Assessment', 'Skills assessment outcome letter from relevant authority'),
    
    (v_visa_id, 4, 'English Language Test',
     'You must demonstrate Competent English through one of these tests:\n\n**IELTS (Academic or General)**\n- Overall: 6.0\n- Minimum per band: 5.0\n\n**PTE Academic**\n- Overall: 50\n- Minimum per skill: 36\n\n**TOEFL iBT**\n- Total: 64\n- Reading: 4, Listening: 4, Speaking: 14, Writing: 14\n\n**Cambridge C1 Advanced**\n- Overall: 169\n- Minimum per skill: 154\n\nTest must be taken within 3 years of application.',
     'English Test Results', 'Official test result certificate or online verification'),
    
    (v_visa_id, 5, 'Australian Federal Police Check',
     'You must provide an Australian National Police Check (NPC):\n\n- Apply via Australian Federal Police website\n- Purpose code: 33 (Immigration/Citizenship)\n- Must be less than 12 months old at time of application\n\n**Overseas police certificates** may be required if you have spent 12+ months in any country in the last 10 years.',
     'Character Documents', 'AFP National Police Check and overseas police certificates if applicable'),
    
    (v_visa_id, 6, 'Health Examinations',
     'Health requirements must be met:\n\n- Book examinations with Bupa Medical Visa Services\n- Use your HAP ID (generated after application submission)\n- Standard checks include: medical examination, chest x-ray, HIV test\n\n**Health insurance** is mandatory - arrange Overseas Visitor Health Cover (OVHC) before visa grant.',
     'Health Documents', 'Health examination referrals (HAP ID generated post-application)'),
    
    (v_visa_id, 7, 'Arrange Health Insurance',
     'You must maintain adequate health insurance for the entire stay:\n\n- Overseas Visitor Health Cover (OVHC) is required\n- Can be arranged with providers like Bupa, Medibank, Allianz, nib\n- Must commence from visa grant date\n- Keep certificate of coverage for your records\n\nNote: Some countries have reciprocal healthcare agreements, but OVHC is still recommended.',
     'Insurance', 'OVHC policy certificate showing coverage period'),
    
    (v_visa_id, 8, 'Submit Application via ImmiAccount',
     'Submit your application online through ImmiAccount:\n\n1. Create/login to ImmiAccount\n2. Select "New Application" → "Temporary Graduate"\n3. Complete all sections accurately\n4. Upload all required documents\n5. Pay application fee (AUD 1,945 base charge)\n6. Submit and note Transaction Reference Number (TRN)\n\n**Processing times (approximate):**\n- 25% of applications: 1-2 months\n- 50% of applications: 2-4 months\n- 90% of applications: 6-9 months',
     'Application Receipt', 'ImmiAccount submission confirmation and payment receipt')
  ON CONFLICT (visa_id, step_number) DO UPDATE SET
    title = EXCLUDED.title,
    body = EXCLUDED.body,
    document_category = EXCLUDED.document_category,
    document_explanation = EXCLUDED.document_explanation;

  -- Insert tracker seed entries (sample data)
  INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight)
  VALUES
    (v_visa_id, NULL, 'user', '2025-10-15', '2026-01-10', 87, 'approved', 1.0),
    (v_visa_id, NULL, 'user', '2025-11-01', '2026-01-25', 85, 'approved', 1.0),
    (v_visa_id, NULL, 'lawyer', '2025-09-20', '2025-12-05', 76, 'approved', 1.5),
    (v_visa_id, NULL, 'user', '2025-08-10', '2025-11-15', 97, 'approved', 1.0),
    (v_visa_id, NULL, 'user', '2025-12-01', NULL, NULL, 'pending', 1.0);

END $$;

-- Create product entry for 485 visa premium content
INSERT INTO public.products (visa_id, price_cents, is_active)
SELECT id, 4900, true FROM public.visas WHERE subclass_number = '485'
ON CONFLICT (visa_id) DO UPDATE SET
  price_cents = EXCLUDED.price_cents,
  updated_at = now();
