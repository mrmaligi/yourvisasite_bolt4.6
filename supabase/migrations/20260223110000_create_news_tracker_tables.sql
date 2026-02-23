-- Migration: Create missing tables for news and tracker
-- Run this in Supabase SQL Editor if migrations haven't been applied

-- 1. news_articles table
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

CREATE INDEX IF NOT EXISTS idx_news_published
  ON public.news_articles(is_published, published_at DESC);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'news_articles' AND policyname = 'Public view published articles'
    ) THEN
        CREATE POLICY "Public view published articles"
          ON public.news_articles FOR SELECT
          USING (is_published = true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'news_articles' AND policyname = 'Authors manage own articles'
    ) THEN
        CREATE POLICY "Authors manage own articles"
          ON public.news_articles FOR ALL
          USING (auth.uid() = author_id)
          WITH CHECK (auth.uid() = author_id);
    END IF;
END $$;

-- 2. news_comments table
CREATE TABLE IF NOT EXISTS public.news_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'news_comments' AND policyname = 'Public read comments'
    ) THEN
        CREATE POLICY "Public read comments"
          ON public.news_comments FOR SELECT
          USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'news_comments' AND policyname = 'Users manage own comments'
    ) THEN
        CREATE POLICY "Users manage own comments"
          ON public.news_comments FOR ALL
          USING (auth.uid() = author_id)
          WITH CHECK (auth.uid() = author_id);
    END IF;
END $$;

-- 3. tracker_stats table
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

ALTER TABLE public.tracker_stats ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'tracker_stats' AND policyname = 'Public view tracker stats'
    ) THEN
        CREATE POLICY "Public view tracker stats"
          ON public.tracker_stats FOR SELECT
          USING (true);
    END IF;
END $$;

-- 4. Add updated_at triggers
CREATE OR REPLACE FUNCTION extensions.moddatetime()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS news_articles_updated_at ON public.news_articles;
CREATE TRIGGER news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime();

DROP TRIGGER IF EXISTS news_comments_updated_at ON public.news_comments;
CREATE TRIGGER news_comments_updated_at
  BEFORE UPDATE ON public.news_comments
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime();

-- 5. Insert sample news article (optional)
INSERT INTO public.news_articles (title, slug, body, is_published, published_at)
SELECT 
  'Welcome to VisaBuild',
  'welcome-to-visabuild',
  'Welcome to VisaBuild, your comprehensive platform for Australian visa information and applications. We provide up-to-date visa details, processing time tracking, and expert consultation services.',
  true,
  now()
WHERE NOT EXISTS (SELECT 1 FROM public.news_articles WHERE slug = 'welcome-to-visabuild');

-- Verify tables were created
SELECT 'news_articles' as table_name, COUNT(*) as count FROM public.news_articles
UNION ALL
SELECT 'news_comments', COUNT(*) FROM public.news_comments
UNION ALL
SELECT 'tracker_stats', COUNT(*) FROM public.tracker_stats;
