-- ============================================================================
-- FINAL ALIGNMENT FIX FOR VISABUILD (VERSION 8 - ULTIMATE)
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- 1. FIX THE SIGNUP TRIGGER (Fixes "Signup not working")
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', ''),
    -- Cast through text to ensure compatibility with user_role enum
    COALESCE((NEW.raw_user_meta_data ->> 'role')::text, 'user')::public.user_role,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Ensure trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. RESET RLS POLICIES (Fixes the 500 Infinite Recursion error)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_profiles DISABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('profiles', 'lawyer_profiles') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_full" ON public.profiles FOR ALL USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

CREATE POLICY "lawyer_read_all" ON public.lawyer_profiles FOR SELECT USING (true);
CREATE POLICY "lawyer_update_self" ON public.lawyer_profiles FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- 3. SCHEMA AND VIEW COMPATIBILITY
CREATE SCHEMA IF NOT EXISTS lawyer;
GRANT USAGE ON SCHEMA lawyer TO anon, authenticated;

-- Force recreation of views
DROP VIEW IF EXISTS lawyer.profiles CASCADE;
DROP VIEW IF EXISTS lawyer.consultation_slots CASCADE;
DROP VIEW IF EXISTS public.news CASCADE;
DROP VIEW IF EXISTS public.forum_posts CASCADE;

CREATE VIEW lawyer.profiles AS 
SELECT 
    id, user_id as profile_id, bar_number, jurisdiction, practice_areas, 
    years_experience, bio, hourly_rate_cents, is_verified, verification_status,
    created_at, updated_at
FROM public.lawyer_profiles;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'consultation_slots' AND table_schema = 'public') THEN
        EXECUTE 'CREATE VIEW lawyer.consultation_slots AS SELECT id, lawyer_id, start_time, end_time, is_booked, created_at FROM public.consultation_slots';
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lawyer_availability_slots' AND table_schema = 'public') THEN
        EXECUTE 'CREATE VIEW lawyer.consultation_slots AS SELECT id, lawyer_id, starts_at as start_time, ends_at as end_time, is_booked, created_at FROM public.lawyer_availability_slots';
    END IF;
END $$;

-- 4. PUBLIC TABLE ALIGNMENT
CREATE VIEW public.news AS SELECT * FROM public.news_articles;
CREATE VIEW public.forum_posts AS SELECT * FROM public.forum_topics;

-- 5. DASHBOARD STATISTICS RPC
CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    uid uuid := auth.uid();
    doc_count integer;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_documents' AND table_schema = 'public') THEN
        SELECT count(*) INTO doc_count FROM public.user_documents WHERE user_id = uid;
    ELSE
        SELECT count(*) INTO doc_count FROM public.documents WHERE user_id = uid;
    END IF;

    SELECT json_build_object(
        'savedVisas', (SELECT count(*) FROM public.saved_visas WHERE user_id = uid),
        'myVisas', (SELECT count(*) FROM public.tracker_entries WHERE submitted_by = uid),
        'documents', doc_count,
        'upcomingConsultations', (SELECT count(*) FROM public.bookings WHERE user_id = uid AND scheduled_at > now() AND status != 'cancelled')
    ) INTO result;
    RETURN result;
END;
$$;

-- 6. PERMISSIONS AND PostgREST
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA lawyer TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_dashboard_stats() TO authenticated;

ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, graphql_public, lawyer';
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';

SELECT 'Alignment Fix VERSION 8 Applied Successfully' as status;
