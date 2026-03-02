-- ============================================================================
-- VISABUILD DATABASE FIX SCRIPT
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ============================================================================

-- 1. FIX RLS FOR PROFILES (Makes them publicly readable)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users access own data only" ON public.profiles;
DROP POLICY IF EXISTS "Lawyers view public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins full access" ON public.profiles;
DROP POLICY IF EXISTS "Public view profiles" ON public.profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Public view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- 2. FIX RLS FOR LAWYER PROFILES
ALTER TABLE public.lawyer_profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Verified lawyers public" ON public.lawyer_profiles;
DROP POLICY IF EXISTS "Lawyers manage own profiles" ON public.lawyer_profiles;
DROP POLICY IF EXISTS "Public view lawyer profiles" ON public.lawyer_profiles;

CREATE POLICY "Public view lawyer profiles" ON public.lawyer_profiles FOR SELECT USING (true);
CREATE POLICY "Lawyers manage own profiles" ON public.lawyer_profiles FOR ALL USING (user_id = auth.uid());

ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.lawyer_profiles TO anon, authenticated;

-- 3. EXPOSE 'lawyer' SCHEMA TO API (Required for frontend)
-- Run this to allow supabase.schema('lawyer') to work
DO $$
BEGIN
    -- Only run if the schema exists
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'lawyer') THEN
        GRANT USAGE ON SCHEMA lawyer TO anon, authenticated;
        GRANT SELECT ON ALL TABLES IN SCHEMA lawyer TO anon;
        GRANT ALL ON ALL TABLES IN SCHEMA lawyer TO authenticated;
        
        -- Add 'lawyer' to the exposed schemas in PostgREST
        ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, graphql_public, lawyer';
    END IF;
END $$;

-- 4. FIX COMMON NAMING MISMATCHES (Adds aliases for compatibility)
-- If your frontend/tests expect 'news' but it's named 'news_articles'
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news_articles' AND table_schema = 'public') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news' AND table_schema = 'public') THEN
        CREATE VIEW public.news AS SELECT * FROM public.news_articles;
        GRANT SELECT ON public.news TO anon, authenticated;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'forum_topics' AND table_schema = 'public') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'forum_posts' AND table_schema = 'public') THEN
        CREATE VIEW public.forum_posts AS SELECT * FROM public.forum_topics;
        GRANT SELECT ON public.forum_posts TO anon, authenticated;
    END IF;
END $$;

-- 5. RELOAD POSTGREST CONFIGURATION
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';

SELECT 'Database fixes applied successfully! Please test the frontend now.' as status;
