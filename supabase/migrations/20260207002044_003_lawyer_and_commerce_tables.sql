/*
  # Lawyer Schema and Commerce Tables

  1. New Tables (lawyer schema)
    - `lawyer.profiles` - bar number, jurisdiction, practice areas, rates, verification
    - `lawyer.consultation_slots` - available time slots per lawyer

  2. New Tables (public schema)
    - `bookings` - consultation bookings between users and lawyers
    - `user_visa_purchases` - records of $49 premium content unlocks
    - `user_documents` - uploaded documents with status tracking
    - `document_shares` - cross-role document sharing (ownership-plus-membership)
    - `promo_codes` - discount codes for marketing
    - `platform_settings` - global configuration key-value store

  3. Indexes
    - B-tree on bookings(user_id), bookings(lawyer_id)
    - B-tree on user_visa_purchases(user_id, visa_id)
    - B-tree on user_documents(user_id)
    - B-tree on document_shares(document_id, lawyer_id)
    - B-tree on lawyer.profiles(is_verified)
*/

-- Ensure schema exists
CREATE SCHEMA IF NOT EXISTS lawyer;

-- lawyer.profiles
CREATE TABLE IF NOT EXISTS lawyer.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  bar_number text NOT NULL DEFAULT '',
  jurisdiction text NOT NULL DEFAULT '',
  practice_areas text[] NOT NULL DEFAULT '{}',
  years_experience integer NOT NULL DEFAULT 0,
  bio text,
  hourly_rate_cents integer,
  is_verified boolean NOT NULL DEFAULT false,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  verification_document_url text,
  rejection_reason text,
  verified_at timestamptz,
  verified_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER lawyer_profiles_updated_at
  BEFORE UPDATE ON lawyer.profiles
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE INDEX IF NOT EXISTS idx_lawyer_verified
  ON lawyer.profiles(is_verified);

-- lawyer.consultation_slots
CREATE TABLE IF NOT EXISTS lawyer.consultation_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  is_booked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  slot_id uuid NOT NULL REFERENCES lawyer.consultation_slots(id) ON DELETE CASCADE,
  duration_minutes integer NOT NULL DEFAULT 30,
  total_price_cents integer NOT NULL DEFAULT 0,
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE INDEX IF NOT EXISTS idx_bookings_user
  ON public.bookings(user_id);

CREATE INDEX IF NOT EXISTS idx_bookings_lawyer
  ON public.bookings(lawyer_id);

-- user_visa_purchases
CREATE TABLE IF NOT EXISTS public.user_visa_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL DEFAULT 4900,
  payment_provider text NOT NULL DEFAULT 'mock',
  payment_id text,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, visa_id)
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_visa
  ON public.user_visa_purchases(user_id, visa_id);

-- user_documents
CREATE TABLE IF NOT EXISTS public.user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  document_category text NOT NULL DEFAULT '',
  file_name text NOT NULL DEFAULT '',
  storage_path text NOT NULL DEFAULT '',
  status public.document_status NOT NULL DEFAULT 'pending',
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_user
  ON public.user_documents(user_id);

-- document_shares
CREATE TABLE IF NOT EXISTS public.document_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.user_documents(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  shared_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  UNIQUE(document_id, lawyer_id)
);

CREATE INDEX IF NOT EXISTS idx_shares_doc_lawyer
  ON public.document_shares(document_id, lawyer_id);

-- promo_codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_percent integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- platform_settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- Seed default platform settings
INSERT INTO public.platform_settings (key, value) VALUES
  ('tracker_alpha', '{"value": 0.3}'),
  ('default_visa_price_cents', '{"value": 4900}'),
  ('min_hourly_rate_cents', '{"value": 5000}'),
  ('max_hourly_rate_cents', '{"value": 50000}')
ON CONFLICT (key) DO NOTHING;
