-- Migration: Add missing legacy and specialized Australian visas (approx 39 subclasses)
-- Track: 003
-- Status: COMPLETED

INSERT INTO public.visas (
    subclass, name, country, category, is_active,
    cost_aud, processing_time_range, duration, key_requirements,
    base_cost_aud, official_link
) VALUES
(
    '105', 'Skilled - Australian Linked', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by General Skilled Migration',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-australian-linked-105'
),
(
    '119', 'Regional Sponsored Migration Scheme (RSMS)', 'Australia', 'Employer Sponsored', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 187',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/rsms-119'
),
(
    '120', 'Employer Nomination Scheme (ENS)', 'Australia', 'Employer Sponsored', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 186',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/ens-120'
),
(
    '121', 'Employer Nomination', 'Australia', 'Employer Sponsored', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 186',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-121'
),
(
    '124', 'Distinguished Talent (Offshore)', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 858',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/distinguished-talent-124'
),
(
    '134', 'Skill Matching', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Legacy skilled visa',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skill-matching-134'
),
(
    '136', 'Skilled - Independent', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 175, then 189',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-136'
),
(
    '137', 'Skilled - State/Territory Nominated Independent', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 176, then 190',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-stni-137'
),
(
    '138', 'Skilled - Australian Sponsored', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 176, then 190',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-australian-sponsored-138'
),
(
    '139', 'Skilled - Designated Area Sponsored', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 475/487, then 489, then 491',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-designated-area-139'
),
(
    '405', 'Investor Retirement', 'Australia', 'Retirement', false,
    'Variable', 'N/A', 'Temporary', 'Closed to new applicants',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/investor-retirement-405'
),
(
    '410', 'Retirement', 'Australia', 'Retirement', false,
    'Variable', 'N/A', 'Temporary', 'Closed to new applicants',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/retirement-410'
),
(
    '411', 'Exchange', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 408',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/exchange-411'
),
(
    '415', 'Foreign Government Agency', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 403',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/foreign-government-agency-415'
),
(
    '416', 'Special Program', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 408',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/special-program-416'
),
(
    '419', 'Visiting Academic', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 408',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visiting-academic-419'
),
(
    '420', 'Entertainment', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 408',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/entertainment-420'
),
(
    '421', 'Sport', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 408',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/sport-421'
),
(
    '422', 'Medical Practitioner', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 457, then 482',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/medical-practitioner-422'
),
(
    '423', 'Media and Film Staff', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 408',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/media-film-staff-423'
),
(
    '424', 'Skilled - Overseas Student', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Temporary', 'Legacy skilled visa',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-overseas-student-424'
),
(
    '425', 'Skilled - Independent', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Temporary', 'Legacy skilled visa',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-425'
),
(
    '448', 'Medical Practitioner', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Temporary', 'Legacy medical visa',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/medical-practitioner-448'
),
(
    '450', 'Diplomatic/Consular', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Temporary', 'For diplomats',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/diplomatic-450'
),
(
    '459', 'Sponsored Business Visitor (Short Stay)', 'Australia', 'Visitor', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 600',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/sponsored-business-visitor-459'
),
(
    '460', 'Medical Practitioner', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Temporary', 'Legacy medical visa',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/medical-practitioner-460'
),
(
    '470', 'Professional Development', 'Australia', 'Special & Other', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 402/408',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/professional-development-470'
),
(
    '486', 'Skilled - Regional Sponsored', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Temporary', 'Replaced by 489, then 491',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-regional-sponsored-486'
),
(
    '498', 'Medical Practitioner', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Temporary', 'Legacy medical visa',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/medical-practitioner-498'
),
(
    '786', 'Temporary Protection (Humanitarian Concern)', 'Australia', 'Humanitarian', true,
    'Free', 'Variable', 'Temporary', 'For specific humanitarian cases',
    0, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-protection-786'
),
(
    '800', 'Territorial Asylum', 'Australia', 'Humanitarian', true,
    'Free', 'Variable', 'Permanent', 'Rarely used',
    0, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/territorial-asylum-800'
),
(
    '834', 'Permanent Resident of Norfolk Island', 'Australia', 'Special & Other', true,
    'Variable', 'N/A', 'Permanent', 'For Norfolk Island residents',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/permanent-resident-norfolk-island-834'
),
(
    '844', 'Contributory Aged Parent (Onshore)', 'Australia', 'Parent', true,
    '$4,765 + $43,600', 'Variable', 'Permanent', 'Onshore contributory parent',
    4765, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-aged-parent-844'
),
(
    '880', 'Skilled - Independent (Onshore)', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 885, then 189',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-880'
),
(
    '881', 'Skilled - Australian Sponsored (Onshore)', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 886, then 190',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-australian-sponsored-881'
),
(
    '882', 'Skilled - Designated Area Sponsored (Onshore)', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Replaced by 887/489/491',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-designated-area-882'
),
(
    '883', 'Skilled - Australian Sponsored (Onshore)', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Legacy skilled visa',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-australian-sponsored-883'
),
(
    '885', 'Skilled - Independent (Residence)', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Closed to new applicants',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-885'
),
(
    '886', 'Skilled - Sponsored (Residence)', 'Australia', 'Skilled Migration', false,
    'Variable', 'N/A', 'Permanent', 'Closed to new applicants',
    NULL, 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-sponsored-886'
)
ON CONFLICT (subclass) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    is_active = EXCLUDED.is_active,
    cost_aud = EXCLUDED.cost_aud,
    processing_time_range = EXCLUDED.processing_time_range,
    duration = EXCLUDED.duration,
    key_requirements = EXCLUDED.key_requirements,
    base_cost_aud = COALESCE(public.visas.base_cost_aud, EXCLUDED.base_cost_aud),
    official_link = EXCLUDED.official_link,
    updated_at = NOW();
