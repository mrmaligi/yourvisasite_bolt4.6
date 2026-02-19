-- ============================================================
-- VisaBuild Complete Database Setup - RUN THIS IN SUPABASE SQL EDITOR
-- URL: https://supabase.com/dashboard/project/zogfvzzizbbmmmnlzxdg/sql
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. CORE TABLES
-- ============================================================

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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  bar_number TEXT,
  jurisdiction TEXT,
  practice_areas TEXT[],
  years_experience INTEGER,
  hourly_rate_cents INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending',
  verification_document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.visa_premium_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  document_category TEXT,
  document_explanation TEXT,
  document_example_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(visa_id, step_number)
);

CREATE TABLE IF NOT EXISTS public.user_visa_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  amount_paid_cents INTEGER,
  stripe_session_id TEXT,
  UNIQUE(user_id, visa_id)
);

CREATE TABLE IF NOT EXISTS public.saved_visas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, visa_id)
);

CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_id UUID REFERENCES public.visas(id) ON DELETE SET NULL,
  document_category TEXT,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tracker_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitter_role TEXT,
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
  notes TEXT,
  amount_cents INTEGER,
  payment_status TEXT DEFAULT 'unpaid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.consultation_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lawyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. RLS POLICIES
-- ============================================================

ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_premium_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_visa_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visas are viewable by everyone" ON public.visas FOR SELECT USING (true);
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own saved visas" ON public.saved_visas FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own documents" ON public.user_documents FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Tracker entries are viewable by everyone" ON public.tracker_entries FOR SELECT USING (true);

-- ============================================================
-- 3. SEED ESSENTIAL VISAS
-- ============================================================

INSERT INTO public.visas (subclass, name, country, category, is_active, cost_aud, processing_time_range, duration, key_requirements, official_url) VALUES
('189', 'Skilled Independent', 'Australia', 'work', true, '$4,640', '8-12 months', 'Permanent', 'Points test 65+, Skills assessment, Competent English', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189'),
('190', 'Skilled Nominated', 'Australia', 'work', true, '$4,640', '8-12 months', 'Permanent', 'State nomination, Points test 65+, Skills assessment', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190'),
('491', 'Skilled Work Regional', 'Australia', 'work', true, '$4,640', '8-12 months', '5 years', 'State/family nomination, Regional work requirement', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491'),
('482', 'Temporary Skill Shortage', 'Australia', 'work', true, '$1,455', '1-3 months', '2-4 years', 'Employer sponsorship, Skills assessment, 2 years experience', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482'),
('186', 'Employer Nomination Scheme', 'Australia', 'work', true, '$4,640', '6-11 months', 'Permanent', 'Employer nomination, 3 years experience, Skills assessment', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186'),
('500', 'Student', 'Australia', 'student', true, '$710', '1-3 months', 'Course duration', 'Enrollment in CRICOS course, Financial capacity, English proficiency', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500'),
('485', 'Temporary Graduate', 'Australia', 'student', true, '$1,895', '2-4 months', '2-4 years', 'Recent Australian qualification, English proficiency', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485'),
('600', 'Visitor', 'Australia', 'visitor', true, '$190', '20-30 days', '3-12 months', 'Genuine temporary visitor, Financial capacity', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600'),
('417', 'Working Holiday', 'Australia', 'visitor', true, '$635', '1-2 weeks', '12 months', 'Age 18-30, Eligible passport, $5,000 funds', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/working-holiday-417'),
('309', 'Partner (Provisional)', 'Australia', 'family', true, '$8,085', '12-18 months', '2 years', 'Genuine relationship, Sponsor is Australian PR/citizen', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-provisional-309'),
('820', 'Partner (Temporary)', 'Australia', 'family', true, '$8,085', '12-18 months', '2 years', 'Genuine relationship, In Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-temporary-820'),
('801', 'Partner (Permanent)', 'Australia', 'family', true, '$1,435', 'With 820 grant', 'Permanent', 'Hold 820 for 2 years, Relationship continues', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-permanent-801'),
('143', 'Contributory Parent', 'Australia', 'family', true, '$47,755', '5-6 years', 'Permanent', 'Balance of family test, Assurance of support', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-143'),
('188', 'Business Innovation and Investment', 'Australia', 'business', true, '$9,455', '12-24 months', '5 years', 'Business ownership OR Investment $2.5M+', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188'),
('858', 'Global Talent', 'Australia', 'work', true, '$4,110', '1-3 months', 'Permanent', 'High income threshold OR Exceptional talent', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/global-talent-858'),
('476', 'Skilled Recognised Graduate', 'Australia', 'work', true, '$465', '7-9 months', '18 months', 'Recent engineering degree from specified institutions', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-recognised-graduate-476'),
('887', 'Skilled Regional Permanent', 'Australia', 'work', true, '$425', '12-15 months', 'Permanent', 'Live in regional area 2+ years, Work 1+ year', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-regional-887'),
('407', 'Training', 'Australia', 'work', true, '$405', '4-6 months', '2 years', 'Nomination from approved organisation, Genuine training need', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/training-407'),
('444', 'Special Category (NZ Citizen)', 'Australia', 'work', true, 'Free', 'Instant', 'Indefinite', 'New Zealand citizen, Special category visa on arrival', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/special-category-444'),
('010', 'Bridging A', 'Australia', 'other', true, 'Free', 'Automatic', 'Until decision', 'Applied for substantive visa in Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/bridging-a-010');

-- ============================================================
-- 4. CREATE MOCK USERS
-- ============================================================

-- Create 10 regular users
DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Sarah Chen','James Wilson','Priya Patel','Mohammed Al-Hassan','Emma Thompson','Carlos Rodriguez','Yuki Tanaka','Fatima Ahmed','Liam OBrien','Sofia Rossi'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    -- Create auth user
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
      gen_random_uuid(),
      'user' || i || '@visabuild.test',
      crypt('TestPass123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email"}',
      jsonb_build_object('full_name', names[i]),
      'authenticated',
      'authenticated'
    )
    ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('TestPass123!', gen_salt('bf'))
    RETURNING id INTO user_id;
  END LOOP;
END $$;

-- Create 10 lawyers
DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Dr Amanda Hayes','Barrister Raj Kapoor','Sarah Mitchell LLB','David Park','Maria Santos','Thomas Wright','Aisha Khan','Robert Chen','Jennifer Adams','Michael Brown'];
  jurisdictions text[] := ARRAY['NSW','VIC','QLD','WA','SA','NSW','VIC','QLD','WA','SA'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
      gen_random_uuid(),
      'lawyer' || i || '@visabuild.test',
      crypt('TestPass123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email"}',
      jsonb_build_object('full_name', names[i]),
      'authenticated',
      'authenticated'
    )
    ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('TestPass123!', gen_salt('bf'))
    RETURNING id INTO user_id;
    
    -- Update profile as lawyer
    UPDATE public.profiles SET 
      role = 'lawyer',
      bar_number = 'AU-' || (10000 + floor(random() * 90000)),
      jurisdiction = jurisdictions[i],
      years_experience = 5 + floor(random() * 20),
      hourly_rate_cents = (150 + floor(random() * 300)) * 100,
      is_verified = true,
      verification_status = 'approved'
    WHERE id = user_id;
  END LOOP;
END $$;

-- Create 10 admins
DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Alex Admin','System Moderator','Content Manager','Support Lead','Security Admin','Data Admin','User Admin','Finance Admin','Tech Admin','Super Admin'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
      gen_random_uuid(),
      'admin' || i || '@visabuild.test',
      crypt('TestPass123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email"}',
      jsonb_build_object('full_name', names[i]),
      'authenticated',
      'authenticated'
    )
    ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('TestPass123!', gen_salt('bf'))
    RETURNING id INTO user_id;
    
    UPDATE public.profiles SET role = 'admin' WHERE id = user_id;
  END LOOP;
END $$;

-- ============================================================
-- 5. VERIFY SETUP
-- ============================================================

SELECT 'Visas created: ' || COUNT(*)::text as status FROM public.visas
UNION ALL
SELECT 'Profiles created: ' || COUNT(*)::text FROM public.profiles
UNION ALL
SELECT 'Auth users created: ' || COUNT(*)::text FROM auth.users WHERE email LIKE '%@visabuild.test';
