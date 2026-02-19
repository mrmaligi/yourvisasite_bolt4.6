-- SQL_5: VISAS PART 3 (Remaining Visas)
-- Run this fifth

INSERT INTO public.visas (subclass, name, country, category, is_active, cost_aud, processing_time_range, duration, key_requirements, official_url) VALUES
('010', 'Bridging A', 'Australia', 'other', true, 'Free', 'Automatic', 'Until decision', 'Applied for substantive visa in Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/bridging-a-010'),
('020', 'Bridging B', 'Australia', 'other', true, '$180', 'Varies', 'For travel', 'Hold Bridging A, Need to travel', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/bridging-b-020'),
('050', 'Bridging (General)', 'Australia', 'other', true, 'Free', 'Varies', 'Until decision', 'Unlawful non-citizen applying for visa', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/bridging-general-050'),
('051', 'Bridging (Protection Visa Applicant)', 'Australia', 'humanitarian', true, 'Free', 'Varies', 'Until decision', 'Applying for protection visa', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/bridging-protection-visa-applicant-051'),
('785', 'Temporary Protection', 'Australia', 'humanitarian', true, 'Free', 'Varies', '3 years', 'Temporary protection status', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-protection-785'),
('786', 'Safe Haven Enterprise', 'Australia', 'humanitarian', true, 'Free', 'Varies', '3 years', 'Safe Haven Enterprise Visa', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/safe-haven-enterprise-786'),
('790', 'Safe Haven Enterprise', 'Australia', 'humanitarian', true, 'Free', 'Varies', '5 years', 'Work and study in regional Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/safe-haven-enterprise-790'),
('866', 'Protection', 'Australia', 'humanitarian', true, '$40', 'Varies', 'Permanent', 'Protection visa for refugees', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/protection-866'),
('201', 'In-country Special Humanitarian', 'Australia', 'humanitarian', true, '$40', 'Varies', 'Permanent', 'Compelling humanitarian circumstances', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/in-country-special-humanitarian-201'),
('202', 'Global Special Humanitarian', 'Australia', 'humanitarian', true, '$40', 'Varies', 'Permanent', 'Proposer in Australia, Compelling reasons', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/global-special-humanitarian-202'),
('203', 'Emergency Rescue', 'Australia', 'humanitarian', true, '$40', 'Priority', 'Permanent', 'Urgent and compelling humanitarian circumstances', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/emergency-rescue-203'),
('204', 'Woman at Risk', 'Australia', 'humanitarian', true, '$40', 'Priority', 'Permanent', 'Woman without male protection, Compelling circumstances', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/woman-at-risk-204'),
('151', 'Citizen (by descent)', 'Australia', 'other', true, '$345', '3-6 months', 'Citizenship', 'Born overseas to Australian parent', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/citizen-by-descent-151'),
('155', 'Resident Return (5 years)', 'Australia', 'other', true, '$425', '1-3 weeks', '5 years', 'Permanent resident returning, Meet residence requirement', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/resident-return-155'),
('157', 'Resident Return (3 months)', 'Australia', 'other', true, '$425', '1-3 weeks', '3 months', 'Permanent resident, Compelling reasons for absence', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/resident-return-157'),
('957', 'New Zealand Citizen Family Relationship (Temporary)', 'Australia', 'family', true, '$425', 'Varies', '2 years', 'Temporary family member of NZ citizen', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/new-zealand-citizen-family-relationship-temporary-957'),
('891', 'Investor (Residence)', 'Australia', 'business', false, 'N/A', 'N/A', 'Closed', 'Replaced by 188/888', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/investor-residence-891'),
('892', 'State/Territory Sponsored Business Owner', 'Australia', 'business', false, 'N/A', 'N/A', 'Closed', 'Replaced by 188/888', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/state-territory-sponsored-business-owner-892'),
('893', 'State/Territory Sponsored Investor', 'Australia', 'business', false, 'N/A', 'N/A', 'Closed', 'Replaced by 188/888', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/state-territory-sponsored-investor-893')
ON CONFLICT (subclass) DO NOTHING;

SELECT 'Total visas: ' || COUNT(*)::text FROM public.visas;
