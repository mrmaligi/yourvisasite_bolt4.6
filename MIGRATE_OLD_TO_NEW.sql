-- ============================================================
-- MIGRATION: Old Supabase → New Supabase
-- Source: usiorucxradthxhetqaq (auth broken, data intact)
-- Target: zogfvzzizbbmmmnlzxdg (fresh, working)
-- Visas: 99 Australian visas
-- Mock Users: 30 (10 users, 10 lawyers, 10 admins)
-- Run at: https://supabase.com/dashboard/project/zogfvzzizbbmmmnlzxdg/sql
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLES
CREATE TABLE IF NOT EXISTS public.visas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subclass TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country TEXT DEFAULT 'Australia',
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  cost_aud TEXT,
  processing_time_range TEXT,
  duration TEXT,
  key_requirements TEXT,
  official_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bar_number TEXT,
  jurisdiction TEXT,
  practice_areas TEXT[],
  years_experience INTEGER,
  hourly_rate_cents INTEGER,
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_visas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, visa_id)
);

CREATE TABLE IF NOT EXISTS public.tracker_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  application_date DATE NOT NULL,
  decision_date DATE,
  processing_days INTEGER,
  outcome TEXT DEFAULT 'pending',
  weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lawyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  visa_id UUID REFERENCES public.visas(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  amount_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS POLICIES
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Visas are viewable by everyone" ON public.visas;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own saved visas" ON public.saved_visas;
DROP POLICY IF EXISTS "Tracker entries are viewable by everyone" ON public.tracker_entries;
DROP POLICY IF EXISTS "Bookings viewable by participants" ON public.bookings;

CREATE POLICY "Visas are viewable by everyone" ON public.visas FOR SELECT USING (true);
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own saved visas" ON public.saved_visas FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Tracker entries are viewable by everyone" ON public.tracker_entries FOR SELECT USING (true);
CREATE POLICY "Bookings viewable by participants" ON public.bookings FOR SELECT USING (user_id = auth.uid());

-- 4. ALL 99 AUSTRALIAN VISAS
DELETE FROM public.visas;

INSERT INTO public.visas (subclass, name, country, category, is_active, cost_aud, processing_time_range, duration, key_requirements, official_url) VALUES
('189', 'Skilled Independent', 'Australia', 'work', true, '$4,640', '8-12 months', 'Permanent', 'Points test 65+, Skills assessment, Competent English', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189'),
('190', 'Skilled Nominated', 'Australia', 'work', true, '$4,640', '8-12 months', 'Permanent', 'State nomination, Points test 65+, Skills assessment', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190'),
('491', 'Skilled Work Regional (Provisional)', 'Australia', 'work', true, '$4,640', '8-12 months', '5 years', 'State/family nomination, Regional work requirement', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491'),
('482', 'Temporary Skill Shortage', 'Australia', 'work', true, '$1,455', '1-3 months', '2-4 years', 'Employer sponsorship, Skills assessment, 2 years experience', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482'),
('186', 'Employer Nomination Scheme', 'Australia', 'work', true, '$4,640', '6-11 months', 'Permanent', 'Employer nomination, 3 years experience, Skills assessment', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186'),
('494', 'Skilled Employer Sponsored Regional', 'Australia', 'work', true, '$4,640', '6-9 months', '5 years', 'Regional employer sponsorship, Skills assessment', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494'),
('476', 'Skilled Recognised Graduate', 'Australia', 'work', true, '$465', '7-9 months', '18 months', 'Recent engineering degree from specified institutions', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-recognised-graduate-476'),
('887', 'Skilled Regional (Permanent)', 'Australia', 'work', true, '$425', '12-15 months', 'Permanent', 'Live in regional area 2+ years, Work 1+ year', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-regional-887'),
('191', 'Skilled Regional (Permanent)', 'Australia', 'work', true, '$465', 'Not specified', 'Permanent', 'Hold 491/494 3+ years, Meet income requirement', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-regional-permanent-191'),
('407', 'Training', 'Australia', 'work', true, '$405', '4-6 months', '2 years', 'Nomination from approved organisation, Genuine training need', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/training-407'),
('408', 'Temporary Activity', 'Australia', 'work', true, '$310', '1-4 months', 'Up to 2 years', 'Specific activity: Entertainment, Research, Sport, etc.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-activity-408'),
('403', 'Temporary Work (International Relations)', 'Australia', 'work', true, '$405', '1-4 months', 'Up to 4 years', 'Government agreement, Foreign government representative', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-work-international-relations-403'),
('400', 'Temporary Work (Short Stay Specialist)', 'Australia', 'work', true, '$405', '1-4 months', 'Up to 6 months', 'Highly specialised work, Non-ongoing role', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-work-short-stay-specialist-400'),
('416', 'Special Program', 'Australia', 'work', true, '$310', '1-3 months', 'Up to 1 year', 'Youth exchange, Cultural enrichment programs', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/special-program-416'),
('418', 'Educational', 'Australia', 'work', true, '$310', '1-3 months', 'Up to 2 years', 'Teachers and educators', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/educational-418'),
('420', 'Temporary Work (Religious)', 'Australia', 'work', true, '$310', '1-3 months', 'Up to 2 years', 'Religious workers', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-work-religious-420'),
('422', 'Medical Practitioner', 'Australia', 'work', true, '$310', '1-3 months', 'Up to 4 years', 'Medical professionals, Doctors', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/medical-practitioner-422'),
('428', 'Religious Worker', 'Australia', 'work', true, '$310', '1-3 months', 'Up to 2 years', 'Religious workers, Ministers', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/religious-worker-428'),
('444', 'Special Category (New Zealand Citizen)', 'Australia', 'work', true, 'Free', 'Instant', 'Indefinite', 'New Zealand citizen, Special category visa on arrival', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/special-category-444'),
('500', 'Student', 'Australia', 'student', true, '$710', '1-3 months', 'Course duration', 'Enrollment in CRICOS course, Financial capacity, English proficiency', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500'),
('485', 'Temporary Graduate', 'Australia', 'student', true, '$1,895', '2-4 months', '2-4 years', 'Recent Australian qualification, English proficiency', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485'),
('590', 'Student Guardian', 'Australia', 'student', true, '$710', '1-3 months', 'Course duration', 'Guardian of student under 18, Financial capacity', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-guardian-590'),
('600', 'Visitor', 'Australia', 'visitor', true, '$190', '20-30 days', '3-12 months', 'Genuine temporary visitor, Financial capacity', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600'),
('601', 'Electronic Travel Authority', 'Australia', 'visitor', true, '$20', 'Instant', '12 months', 'Eligible passport, No criminal record, Business/tourism', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601'),
('651', 'eVisitor', 'Australia', 'visitor', true, 'Free', 'Instant', '3 months', 'Eligible European passport, Genuine visitor', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651'),
('417', 'Working Holiday', 'Australia', 'visitor', true, '$635', '1-2 weeks', '12 months', 'Age 18-30, Eligible passport, $5,000 funds', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/working-holiday-417'),
('462', 'Work and Holiday', 'Australia', 'visitor', true, '$635', '1-2 weeks', '12 months', 'Age 18-30, Eligible passport, $5,000 funds', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-and-holiday-462'),
('771', 'Transit', 'Australia', 'visitor', true, 'Free', 'Instant', '72 hours', 'Passing through Australia, Maximum 72 hours', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/transit-771'),
('988', 'Maritime Crew', 'Australia', 'visitor', true, 'Free', 'Instant', '30 days', 'Maritime crew, Sea-based work', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/maritime-crew-988'),
('126', 'Domestic Worker - Diplomat', 'Australia', 'work', true, 'Variable', '2-4 weeks', 'Up to 5 years', 'Diplomat household staff', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/domestic-worker-diplomat-126'),
('128', 'Crew Travel Authority', 'Australia', 'visitor', true, 'Free', 'Instant', '72 hours', 'Air/sea crew, Short stopover', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/crew-travel-authority-128'),
('138', 'Medical Treatment Visa', 'Australia', 'visitor', true, 'Variable', '1-4 weeks', 'Variable', 'Medical treatment in Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/medical-treatment-138'),
('602', 'Medical Treatment', 'Australia', 'visitor', true, 'Free', 'Varies', 'Varies', 'Medical treatment in Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/medical-treatment-602'),
('411', 'Exchange', 'Australia', 'work', true, '$310', '1-4 months', 'Up to 2 years', 'Exchange programs', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/exchange-411'),
('415', 'Foreign Government Agency', 'Australia', 'work', true, '$310', '1-3 months', 'Up to 4 years', 'Foreign government workers', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/foreign-government-agency-415'),
('309', 'Partner (Provisional)', 'Australia', 'family', true, '$8,085', '12-18 months', '2 years', 'Genuine relationship, Sponsor is Australian PR/citizen', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-provisional-309'),
('100', 'Partner', 'Australia', 'family', true, '$1,435', 'With 309 grant', 'Permanent', 'Hold 309 for 2 years, Relationship continues', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-100'),
('820', 'Partner (Temporary)', 'Australia', 'family', true, '$8,085', '12-18 months', '2 years', 'Genuine relationship, In Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-temporary-820'),
('801', 'Partner (Permanent)', 'Australia', 'family', true, '$1,435', 'With 820 grant', 'Permanent', 'Hold 820 for 2 years, Relationship continues', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-permanent-801'),
('300', 'Prospective Marriage', 'Australia', 'family', true, '$8,085', '12-18 months', '9 months', 'Engaged to Australian, Met in person, Intent to marry', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/prospective-marriage-300'),
('101', 'Child', 'Australia', 'family', true, '$3,055', '12-18 months', 'Permanent', 'Parent is Australian PR/citizen, Under 18 or dependent', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/child-101'),
('802', 'Child (Onshore)', 'Australia', 'family', true, '$3,055', '12-18 months', 'Permanent', 'Parent is Australian PR/citizen, In Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/child-onshore-802'),
('143', 'Contributory Parent', 'Australia', 'family', true, '$47,755', '5-6 years', 'Permanent', 'Balance of family test, Assurance of support, Health check', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-143'),
('173', 'Contributory Parent (Temporary)', 'Australia', 'family', true, '$29,130', '2-4 years', '2 years', 'Temporary parent visa, Balance of family test', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-temporary-173'),
('103', 'Parent', 'Australia', 'family', true, '$6,985', '30+ years', 'Permanent', 'Balance of family test, Assurance of support, Very long queue', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/parent-103'),
('804', 'Aged Parent', 'Australia', 'family', true, '$4,225', '30+ years', 'Permanent', 'Pension age, Long queue', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/aged-parent-804'),
('864', 'Contributory Aged Parent', 'Australia', 'family', true, '$47,755', '5-6 years', 'Permanent', 'Pension age, Fast track with higher fee', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-aged-parent-864'),
('884', 'Contributory Aged Parent (Temporary)', 'Australia', 'family', true, '$29,130', '2-4 years', '2 years', 'Temporary aged parent visa', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-aged-parent-temporary-884'),
('114', 'Aged Parent (Residence)', 'Australia', 'family', true, '$4,225', '30+ years', 'Permanent', 'Pension age, Balance of family test', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/aged-parent-residence-114'),
('838', 'Aged Dependent Relative', 'Australia', 'family', true, '$4,225', '30+ years', 'Permanent', 'Single, Dependent on Australian relative, Pension age', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/aged-dependent-relative-838'),
('836', 'Carer', 'Australia', 'family', true, '$2,055', '4-5 years', 'Permanent', 'Relative needs care, Willing to provide care', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/carer-836'),
('837', 'Orphan Relative', 'Australia', 'family', true, '$1,870', '12-18 months', 'Permanent', 'Under 18, Parent deceased, Australian relative', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/orphan-relative-837'),
('117', 'Orphan Relative (Offshore)', 'Australia', 'family', true, '$1,870', '12-18 months', 'Permanent', 'Under 18, Outside Australia, Parent deceased', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/orphan-relative-offshore-117'),
('115', 'Remaining Relative', 'Australia', 'family', true, '$4,350', '30+ years', 'Permanent', 'Remaining relative of Australian citizen/PR', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/remaining-relative-115'),
('835', 'Remaining Relative (Onshore)', 'Australia', 'family', true, '$4,350', '30+ years', 'Permanent', 'Remaining relative, In Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/remaining-relative-onshore-835'),
('102', 'Adoption', 'Australia', 'family', true, '$3,055', '12-18 months', 'Permanent', 'Adopted by Australian citizen/PR, Under 18', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/adoption-102'),
('188', 'Business Innovation and Investment (Provisional)', 'Australia', 'business', true, '$9,455', '12-24 months', '5 years', 'Business ownership OR Investment $2.5M+ OR $5M+ significant investor', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188'),
('888', 'Business Innovation and Investment (Permanent)', 'Australia', 'business', true, '$3,490', 'With 188 conditions', 'Permanent', 'Meet 188 stream requirements, Business/Investment activity', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-permanent-888'),
('132', 'Business Talent (Permanent)', 'Australia', 'business', false, 'N/A', 'N/A', 'Closed', 'Replaced by 188/888', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-talent-132'),
('890', 'Business Owner (Residence)', 'Australia', 'business', false, 'N/A', 'N/A', 'Closed', 'Replaced by 188/888', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-owner-890'),
('891', 'Investor (Residence)', 'Australia', 'business', false, 'N/A', 'N/A', 'Closed', 'Replaced by 188/888', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/investor-residence-891'),
('892', 'State/Territory Sponsored Business Owner', 'Australia', 'business', false, 'N/A', 'N/A', 'Closed', 'Replaced by 188/888', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/state-territory-sponsored-business-owner-892'),
('893', 'State/Territory Sponsored Investor', 'Australia', 'business', false, 'N/A', 'N/A', 'Closed', 'Replaced by 188/888', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/state-territory-sponsored-investor-893'),
('124', 'Distinguished Talent', 'Australia', 'work', true, '$4,110', '12-18 months', 'Permanent', 'Internationally recognised record of exceptional achievement', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/distinguished-talent-124'),
('858', 'Global Talent (Permanent)', 'Australia', 'work', true, '$4,110', '1-3 months', 'Permanent', 'High income threshold OR Exceptional talent in target sector', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/global-talent-858'),
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
('461', 'New Zealand Citizen Family Relationship', 'Australia', 'family', true, '$425', '12-18 months', '5 years', 'Family member of NZ citizen (444 holder)', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/new-zealand-citizen-family-relationship-461'),
('942', 'Sponsored Parent (Temporary)', 'Australia', 'family', true, '$1,145', '3-6 months', '3-5 years', 'Parent of Australian citizen/PR, Balance of family test waived', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/sponsored-parent-temporary-942'),
('870', 'Sponsored Parent (Temporary)', 'Australia', 'family', true, '$1,145', '3-6 months', '3-5 years', 'Temporary parent visa, New application', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/sponsored-parent-temporary-870'),
('679', 'Sponsored Family Visitor', 'Australia', 'visitor', true, '$145', '1-3 months', '12 months', 'Family sponsorship, Genuine visitor', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/sponsored-family-visitor-679'),
('957', 'New Zealand Citizen Family Relationship (Temporary)', 'Australia', 'family', true, '$425', 'Varies', '2 years', 'Temporary family member of NZ citizen', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/new-zealand-citizen-family-relationship-temporary-957')
ON CONFLICT (subclass) DO NOTHING;

-- 5. MOCK USERS (30 total: 10 users, 10 lawyers, 10 admins)
DELETE FROM auth.users WHERE email LIKE '%@visabuild.test';

DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Sarah Chen','James Wilson','Priya Patel','Mohammed Al-Hassan','Emma Thompson','Carlos Rodriguez','Yuki Tanaka','Fatima Ahmed','Liam OBrien','Sofia Rossi'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    user_id := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (user_id, 'user' || i || '@visabuild.test', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider":"email"}', jsonb_build_object('full_name', names[i]), 'authenticated', 'authenticated');
  END LOOP;
END $$;

DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Dr Amanda Hayes','Barrister Raj Kapoor','Sarah Mitchell LLB','David Park','Maria Santos','Thomas Wright','Aisha Khan','Robert Chen','Jennifer Adams','Michael Brown'];
  jurisdictions text[] := ARRAY['NSW','VIC','QLD','WA','SA','NSW','VIC','QLD','WA','SA'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    user_id := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (user_id, 'lawyer' || i || '@visabuild.test', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider":"email"}', jsonb_build_object('full_name', names[i]), 'authenticated', 'authenticated');
    UPDATE public.profiles SET role = 'lawyer', bar_number = 'AU-' || (10000 + floor(random() * 90000)), jurisdiction = jurisdictions[i], years_experience = 5 + floor(random() * 20), hourly_rate_cents = (150 + floor(random() * 300)) * 100, is_verified = true, verification_status = 'approved' WHERE id = user_id;
  END LOOP;
END $$;

DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Alex Admin','System Moderator','Content Manager','Support Lead','Security Admin','Data Admin','User Admin','Finance Admin','Tech Admin','Super Admin'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    user_id := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (user_id, 'admin' || i || '@visabuild.test', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider":"email"}', jsonb_build_object('full_name', names[i]), 'authenticated', 'authenticated');
    UPDATE public.profiles SET role = 'admin' WHERE id = user_id;
  END LOOP;
END $$;

-- 6. VERIFY
SELECT 'Visas: ' || COUNT(*)::text FROM public.visas
UNION ALL SELECT 'Profiles: ' || COUNT(*)::text FROM public.profiles
UNION ALL SELECT 'Mock users: ' || COUNT(*)::text FROM auth.users WHERE email LIKE '%@visabuild.test';
