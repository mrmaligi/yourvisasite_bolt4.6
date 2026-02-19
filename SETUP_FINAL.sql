-- ============================================================
-- VisaBuild Database Setup - IDEMPOTENT VERSION (handles existing objects)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. CORE TABLES (IF NOT EXISTS)
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
  bar_number TEXT,
  jurisdiction TEXT,
  practice_areas TEXT[],
  years_experience INTEGER,
  hourly_rate_cents INTEGER,
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  amount_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. RLS POLICIES (DROP IF EXISTS, THEN CREATE)
-- ============================================================

ALTER TABLE IF EXISTS public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.saved_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (to avoid "already exists" error)
DROP POLICY IF EXISTS "Visas are viewable by everyone" ON public.visas;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own saved visas" ON public.saved_visas;
DROP POLICY IF EXISTS "Tracker entries are viewable by everyone" ON public.tracker_entries;
DROP POLICY IF EXISTS "Bookings viewable by participants" ON public.bookings;

-- Create policies
CREATE POLICY "Visas are viewable by everyone" ON public.visas FOR SELECT USING (true);
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own saved visas" ON public.saved_visas FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Tracker entries are viewable by everyone" ON public.tracker_entries FOR SELECT USING (true);
CREATE POLICY "Bookings viewable by participants" ON public.bookings FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- 3. SEED ESSENTIAL VISAS (ON CONFLICT DO NOTHING)
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
('309', 'Partner (Provisional)', 'Australia', 'family', true, '$8,085', '12-18 months', '2 years', 'Genuine relationship, Sponsor is Australian PR/citizen', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-provisional-309')
ON CONFLICT (subclass) DO NOTHING;

-- ============================================================
-- 4. CREATE MOCK USERS (Delete first, then insert)
-- ============================================================

-- Delete existing mock users first
DELETE FROM auth.users WHERE email LIKE '%@visabuild.test';

-- Create 10 regular users
DO $$
DECLARE
  i integer;
  names text[] := ARRAY['Sarah Chen','James Wilson','Priya Patel','Mohammed Al-Hassan','Emma Thompson','Carlos Rodriguez','Yuki Tanaka','Fatima Ahmed','Liam OBrien','Sofia Rossi'];
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
      user_id,
      'user' || i || '@visabuild.test',
      crypt('TestPass123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email"}',
      jsonb_build_object('full_name', names[i]),
      'authenticated',
      'authenticated'
    );
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
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
      user_id,
      'lawyer' || i || '@visabuild.test',
      crypt('TestPass123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email"}',
      jsonb_build_object('full_name', names[i]),
      'authenticated',
      'authenticated'
    );
    
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
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
    ) VALUES (
      user_id,
      'admin' || i || '@visabuild.test',
      crypt('TestPass123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email"}',
      jsonb_build_object('full_name', names[i]),
      'authenticated',
      'authenticated'
    );
    
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
