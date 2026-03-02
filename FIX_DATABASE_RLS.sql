-- ============================================================
-- VisaBuild Database RLS Fixes
-- Run this in Supabase SQL Editor to fix permission issues
-- ============================================================

-- ============================================================
-- FIX 1: Safer is_admin() and is_lawyer() functions
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data ->> 'role' = 'admin'
     FROM auth.users
     WHERE id = uid
     AND uid IS NOT NULL),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.is_lawyer(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data ->> 'role' = 'lawyer'
     FROM auth.users
     WHERE id = uid
     AND uid IS NOT NULL),
    false
  );
$$;

-- ============================================================
-- FIX 2: Profiles Table RLS Policies
-- ============================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they cause issues
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Policy: Allow anyone to view active profiles
CREATE POLICY "Public can view active profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policy: Users can view their own profile (even if inactive)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- FIX 3: Lawyer Profiles Table RLS
-- ============================================================

-- Check if lawyer_profiles is in public schema
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = 'lawyer_profiles') THEN
    
    -- Enable RLS
    ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Public can view verified lawyer profiles" ON public.lawyer_profiles;
    DROP POLICY IF EXISTS "Lawyers can manage own profile" ON public.lawyer_profiles;
    DROP POLICY IF EXISTS "Admins can manage lawyer profiles" ON public.lawyer_profiles;
    
    -- Policy: Public can view verified lawyer profiles
    CREATE POLICY "Public can view verified lawyer profiles"
      ON public.lawyer_profiles FOR SELECT
      TO anon, authenticated
      USING (is_verified = true);
    
    -- Policy: Lawyers can manage their own profile
    CREATE POLICY "Lawyers can manage own profile"
      ON public.lawyer_profiles FOR ALL
      TO authenticated
      USING (profile_id = auth.uid())
      WITH CHECK (profile_id = auth.uid());
    
    -- Policy: Admins can manage all lawyer profiles
    CREATE POLICY "Admins can manage lawyer profiles"
      ON public.lawyer_profiles FOR ALL
      TO authenticated
      USING (public.is_admin(auth.uid()))
      WITH CHECK (public.is_admin(auth.uid()));
      
  END IF;
END $$;

-- ============================================================
-- FIX 4: Create Missing Tables (if they don't exist)
-- ============================================================

-- News/Articles Table
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  image_url TEXT,
  author_id UUID REFERENCES public.profiles(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on news_articles
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- News articles policies
DROP POLICY IF EXISTS "Public can view published news" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can manage news" ON public.news_articles;

CREATE POLICY "Public can view published news"
  ON public.news_articles FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage news"
  ON public.news_articles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  category TEXT,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on forum_posts
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Forum posts policies
DROP POLICY IF EXISTS "Public can view forum posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Authenticated can create posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON public.forum_posts;

CREATE POLICY "Public can view forum posts"
  ON public.forum_posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can create posts"
  ON public.forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
  ON public.forum_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Document Templates Table
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  file_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on document_templates
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Document templates policies
DROP POLICY IF EXISTS "Public can view active templates" ON public.document_templates;
DROP POLICY IF EXISTS "Admins can manage templates" ON public.document_templates;

CREATE POLICY "Public can view active templates"
  ON public.document_templates FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON public.document_templates FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- FIX 5: Create Storage Buckets
-- ============================================================

-- Note: These need to be created via Supabase Dashboard or CLI
-- Instructions:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create the following buckets:
--    - "documents" (private)
--    - "lawyer-profiles" (public)
--    - "visa-attachments" (public)
--    - "user-avatars" (public)

-- ============================================================
-- FIX 6: Update Triggers for updated_at
-- ============================================================

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to news_articles
DROP TRIGGER IF EXISTS update_news_articles_updated_at ON public.news_articles;
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Apply to forum_posts
DROP TRIGGER IF EXISTS update_forum_posts_updated_at ON public.forum_posts;
CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Apply to document_templates
DROP TRIGGER IF EXISTS update_document_templates_updated_at ON public.document_templates;
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Completion
-- ============================================================

SELECT 'RLS Fixes Applied Successfully!' as status;
