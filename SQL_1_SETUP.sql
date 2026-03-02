-- SQL_1: EXTENSIONS AND TABLES
-- Run this first

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

SELECT 'Tables created successfully' as status;
