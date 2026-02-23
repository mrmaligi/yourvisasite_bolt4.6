-- =====================================================
-- SUPABASE FIX - Create All Missing Tables
-- Project: zogfvzzizbbmmmnlzxdg
-- Run this in Supabase Dashboard SQL Editor
-- =====================================================

-- 1. DOCUMENT CATEGORIES
CREATE TABLE IF NOT EXISTS public.document_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  tips text,
  icon text NOT NULL DEFAULT 'file',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  explanation text,
  examples text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Safely migrate existing table if it exists
DO $$
BEGIN
    -- Add key column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_categories' AND column_name = 'key') THEN
        ALTER TABLE public.document_categories ADD COLUMN key text;
        -- Update existing rows to have a key based on name (slugified)
        UPDATE public.document_categories SET key = lower(replace(name, ' ', '_')) WHERE key IS NULL;
        ALTER TABLE public.document_categories ALTER COLUMN key SET NOT NULL;
        ALTER TABLE public.document_categories ADD CONSTRAINT document_categories_key_key UNIQUE (key);
    END IF;

    -- Rename sort_order to display_order
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_categories' AND column_name = 'sort_order') THEN
        ALTER TABLE public.document_categories RENAME COLUMN sort_order TO display_order;
    END IF;

    -- Add display_order if it doesn't exist (and sort_order didn't exist)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_categories' AND column_name = 'display_order') THEN
         ALTER TABLE public.document_categories ADD COLUMN display_order integer NOT NULL DEFAULT 0;
    END IF;

    -- Add tips
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_categories' AND column_name = 'tips') THEN
        ALTER TABLE public.document_categories ADD COLUMN tips text;
    END IF;

    -- Add icon
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_categories' AND column_name = 'icon') THEN
        ALTER TABLE public.document_categories ADD COLUMN icon text NOT NULL DEFAULT 'file';
    END IF;

    -- Add explanation
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_categories' AND column_name = 'explanation') THEN
        ALTER TABLE public.document_categories ADD COLUMN explanation text;
    END IF;

    -- Add examples
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_categories' AND column_name = 'examples') THEN
        ALTER TABLE public.document_categories ADD COLUMN examples text[];
    END IF;

    -- Add updated_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_categories' AND column_name = 'updated_at') THEN
        ALTER TABLE public.document_categories ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
    END IF;
END $$;

DROP TRIGGER IF EXISTS document_categories_updated_at ON public.document_categories;
CREATE TRIGGER document_categories_updated_at
  BEFORE UPDATE ON public.document_categories
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- 2. VISA DOCUMENT REQUIREMENTS
CREATE TABLE IF NOT EXISTS public.visa_document_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  document_category_id uuid NOT NULL REFERENCES public.document_categories(id) ON DELETE CASCADE,
  is_required boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(visa_id, document_category_id)
);

-- 3. FORUM CATEGORIES
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. FORUM TOPICS
CREATE TABLE IF NOT EXISTS public.forum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  content text NOT NULL DEFAULT '',
  is_pinned boolean NOT NULL DEFAULT false,
  is_locked boolean NOT NULL DEFAULT false,
  view_count integer NOT NULL DEFAULT 0,
  reply_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

CREATE TRIGGER forum_topics_updated_at
  BEFORE UPDATE ON public.forum_topics
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- 5. FORUM POSTS
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_solution boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- 6. CONSULTATIONS
CREATE TABLE IF NOT EXISTS public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  meeting_link text,
  recording_url text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- 7. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'aud',
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- 8. ELIGIBILITY CHECKS
CREATE TABLE IF NOT EXISTS public.eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}',
  score integer,
  is_eligible boolean,
  recommendations text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. NEWS ARTICLES (if not exists)
CREATE TABLE IF NOT EXISTS public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text NOT NULL DEFAULT '',
  excerpt text,
  image_url text,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Seed Document Categories
INSERT INTO public.document_categories (key, name, description, icon, display_order) VALUES
  ('identity', 'Identity Documents', 'Passport, birth certificate, ID cards', 'user', 1),
  ('relationship', 'Relationship Evidence', 'Marriage certificate, photos, joint documents', 'heart', 2),
  ('financial', 'Financial Documents', 'Bank statements, tax returns, payslips', 'dollar-sign', 3),
  ('employment', 'Employment Documents', 'Employment contracts, reference letters', 'briefcase', 4),
  ('health_character', 'Health & Character', 'Medical exams, police clearances', 'activity', 5),
  ('education', 'Education & Skills', 'Degrees, transcripts, skills assessments', 'book', 6),
  ('travel', 'Travel Documents', 'Previous visas, travel history', 'map', 7),
  ('sponsor', 'Sponsor Documents', 'Sponsor ID, proof of citizenship/residency', 'users', 8)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;

-- Seed Forum Categories
INSERT INTO public.forum_categories (name, description, slug, sort_order) VALUES
  ('General Discussion', 'General immigration topics and questions', 'general', 1),
  ('Visa Applications', 'Share experiences and ask about visa applications', 'visa-applications', 2),
  ('Lawyers & Agents', 'Discuss migration agents and lawyers', 'lawyers-agents', 3),
  ('Success Stories', 'Share your visa success stories', 'success-stories', 4),
  ('Help & Support', 'Get help with technical issues', 'help-support', 5)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ENABLE RLS (Row Level Security)
-- =====================================================

ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Document categories are viewable by everyone" ON public.document_categories FOR SELECT USING (true);
CREATE POLICY "Visa doc requirements are viewable by everyone" ON public.visa_document_requirements FOR SELECT USING (true);
CREATE POLICY "Forum categories are viewable by everyone" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Forum topics are viewable by everyone" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Forum posts are viewable by everyone" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own eligibility checks" ON public.eligibility_checks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "News is viewable by everyone" ON public.news_articles FOR SELECT USING (is_published = true);

-- =====================================================
-- VERIFICATION QUERY (Run after to check)
-- =====================================================
-- SELECT 'document_categories' as table_name, count(*) as count FROM public.document_categories
-- UNION ALL
-- SELECT 'visa_document_requirements', count(*) FROM public.visa_document_requirements
-- UNION ALL
-- SELECT 'forum_categories', count(*) FROM public.forum_categories
-- UNION ALL
-- SELECT 'forum_topics', count(*) FROM public.forum_topics
-- UNION ALL
-- SELECT 'forum_posts', count(*) FROM public.forum_posts
-- UNION ALL
-- SELECT 'consultations', count(*) FROM public.consultations
-- UNION ALL
-- SELECT 'payments', count(*) FROM public.payments
-- UNION ALL
-- SELECT 'eligibility_checks', count(*) FROM public.eligibility_checks;
