/*
  # Core Public Tables and Profile Trigger

  1. New Tables
    - `profiles` - extends auth.users with role, name, avatar, phone
    - `visas` - master visa catalog with subclass, country, category
    - `visa_premium_content` - paid step-by-step guide entries per visa
    - `visa_requirements` - admin-managed JSONB checklists per visa
    - `tracker_entries` - crowdsourced processing time reports
    - `tracker_stats` - pre-computed per-visa statistics cache
    - `news_articles` - published news with slug, markdown body, image
    - `news_comments` - comments on articles (lawyers and admins)
    - `products` - pricing catalog linking visas to Stripe

  2. Triggers
    - `handle_new_user` - auto-creates a profile row on auth.users insert
    - `moddatetime` triggers on all tables with updated_at

  3. Indexes
    - GIN full-text search on visas (name + summary)
    - GIN trigram on visas.name for fuzzy matching
    - B-tree on visas.subclass_number
    - B-tree on tracker_entries(visa_id, created_at DESC)
    - B-tree on news_articles(is_published, published_at DESC)
*/

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'user',
  full_name text,
  avatar_url text,
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- visas
CREATE TABLE IF NOT EXISTS public.visas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subclass_number text UNIQUE NOT NULL,
  name text NOT NULL,
  country text NOT NULL,
  category public.visa_category NOT NULL DEFAULT 'other',
  official_url text,
  summary text,
  processing_fee_description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER visas_updated_at
  BEFORE UPDATE ON public.visas
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE INDEX IF NOT EXISTS idx_visas_fts
  ON public.visas
  USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(summary, '')));

CREATE INDEX IF NOT EXISTS idx_visas_name_trgm
  ON public.visas
  USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_visas_subclass
  ON public.visas(subclass_number);

-- visa_premium_content
CREATE TABLE IF NOT EXISTS public.visa_premium_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  document_category text,
  document_explanation text,
  document_example_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(visa_id, step_number)
);

CREATE TRIGGER visa_premium_content_updated_at
  BEFORE UPDATE ON public.visa_premium_content
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- visa_requirements
CREATE TABLE IF NOT EXISTS public.visa_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_id uuid NOT NULL UNIQUE REFERENCES public.visas(id) ON DELETE CASCADE,
  requirements_json jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER visa_requirements_updated_at
  BEFORE UPDATE ON public.visa_requirements
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- tracker_entries
CREATE TABLE IF NOT EXISTS public.tracker_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  submitted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  submitter_role public.user_role,
  application_date date NOT NULL,
  decision_date date NOT NULL,
  processing_days integer NOT NULL DEFAULT 0,
  outcome public.tracker_outcome NOT NULL DEFAULT 'approved',
  weight numeric NOT NULL DEFAULT 1.0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracker_entries_visa
  ON public.tracker_entries(visa_id);

CREATE INDEX IF NOT EXISTS idx_tracker_entries_visa_date
  ON public.tracker_entries(visa_id, created_at DESC);

-- tracker_stats
CREATE TABLE IF NOT EXISTS public.tracker_stats (
  visa_id uuid PRIMARY KEY REFERENCES public.visas(id) ON DELETE CASCADE,
  weighted_avg_days numeric,
  ewma_days numeric,
  median_days numeric,
  p25_days numeric,
  p75_days numeric,
  total_entries integer NOT NULL DEFAULT 0,
  last_updated timestamptz NOT NULL DEFAULT now()
);

-- news_articles
CREATE TABLE IF NOT EXISTS public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text NOT NULL DEFAULT '',
  image_url text,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE INDEX IF NOT EXISTS idx_news_published
  ON public.news_articles(is_published, published_at DESC);

-- news_comments
CREATE TABLE IF NOT EXISTS public.news_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER news_comments_updated_at
  BEFORE UPDATE ON public.news_comments
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_id uuid NOT NULL UNIQUE REFERENCES public.visas(id) ON DELETE CASCADE,
  stripe_product_id text,
  stripe_price_id text,
  price_cents integer NOT NULL DEFAULT 4900,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- profile auto-creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', ''),
    'user'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
