/*
  # Extensions and Custom Schemas

  1. Extensions Enabled
    - `pg_jsonschema` - JSON Schema validation for JSONB columns
    - `pg_cron` - scheduled job execution for tracker refresh
    - `pg_net` - async HTTP calls from database functions
    - `pgjwt` - JWT introspection in PL/pgSQL
    - `moddatetime` - auto-update updated_at columns
    - `pg_trgm` - trigram fuzzy text matching for visa search
    - `fuzzystrmatch` - Levenshtein distance for misspelling tolerance

  2. Custom Schemas
    - `lawyer` - professional credentials, rates, analytics
    - `stripe` - financial records and payment sync (service_role only)

  3. Security
    - `lawyer` schema: USAGE granted to authenticated and service_role
    - `stripe` schema: USAGE granted to service_role only

  4. Custom Enums
    - `user_role` - user, lawyer, admin
    - `visa_category` - work, family, student, visitor, humanitarian, business, other
    - `tracker_outcome` - approved, refused, withdrawn
    - `booking_status` - pending, confirmed, completed, cancelled
    - `document_status` - pending, verified, rejected
    - `verification_status` - pending, approved, rejected
*/

-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_jsonschema WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA extensions;

-- Custom schemas
CREATE SCHEMA IF NOT EXISTS lawyer;
CREATE SCHEMA IF NOT EXISTS stripe;

GRANT USAGE ON SCHEMA lawyer TO authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA lawyer TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA lawyer GRANT ALL ON TABLES TO service_role;

GRANT USAGE ON SCHEMA stripe TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA stripe TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA stripe GRANT ALL ON TABLES TO service_role;

-- Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('user', 'lawyer', 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visa_category') THEN
    CREATE TYPE public.visa_category AS ENUM ('work', 'family', 'student', 'visitor', 'humanitarian', 'business', 'other');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tracker_outcome') THEN
    CREATE TYPE public.tracker_outcome AS ENUM ('approved', 'refused', 'withdrawn');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE public.document_status AS ENUM ('pending', 'verified', 'rejected');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
    CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;
