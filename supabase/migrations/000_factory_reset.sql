-- SUPABASE FACTORY RESET SCRIPT
-- WARNING: This will DELETE ALL DATA and recreate from scratch

-- Step 1: Drop all triggers first (they depend on functions)
DO $$
DECLARE
    trig RECORD;
BEGIN
    FOR trig IN 
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers
        WHERE trigger_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', trig.trigger_name, trig.event_object_table);
    END LOOP;
END $$;

-- Step 2: Drop all functions
DO $$
DECLARE
    func RECORD;
BEGIN
    FOR func IN 
        SELECT routine_name, routine_schema
        FROM information_schema.routines
        WHERE routine_type = 'FUNCTION'
        AND routine_schema IN ('public', 'lawyer', 'stripe')
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I CASCADE', func.routine_schema, func.routine_name);
    END LOOP;
END $$;

-- Step 3: Disable RLS and drop all policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname IN ('public', 'lawyer', 'stripe')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Step 4: Drop all tables (reverse order to handle dependencies)
DROP TABLE IF EXISTS public.email_notifications CASCADE;
DROP TABLE IF EXISTS public.notification_preferences CASCADE;
DROP TABLE IF EXISTS public.contact_submissions CASCADE;
DROP TABLE IF EXISTS public.success_stories CASCADE;
DROP TABLE IF EXISTS public.quiz_results CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.forum_subscriptions CASCADE;
DROP TABLE IF EXISTS public.forum_reply_votes CASCADE;
DROP TABLE IF EXISTS public.forum_topic_votes CASCADE;
DROP TABLE IF EXISTS public.forum_replies CASCADE;
DROP TABLE IF EXISTS public.forum_topics CASCADE;
DROP TABLE IF EXISTS public.forum_categories CASCADE;
DROP TABLE IF EXISTS public.template_reviews CASCADE;
DROP TABLE IF EXISTS public.user_template_purchases CASCADE;
DROP TABLE IF EXISTS public.document_templates CASCADE;
DROP TABLE IF EXISTS public.user_visas CASCADE;
DROP TABLE IF EXISTS public.saved_visas CASCADE;
DROP TABLE IF EXISTS public.marketplace_reviews CASCADE;
DROP TABLE IF EXISTS public.marketplace_purchases CASCADE;
DROP TABLE IF EXISTS public.marketplace_listings CASCADE;
DROP TABLE IF EXISTS public.marketplace_categories CASCADE;
DROP TABLE IF EXISTS public.consultation_slots CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.tracker_entries CASCADE;
DROP TABLE IF EXISTS public.news_comments CASCADE;
DROP TABLE IF EXISTS public.news_articles CASCADE;
DROP TABLE IF EXISTS public.youtube_feeds CASCADE;
DROP TABLE IF EXISTS public.premium_content CASCADE;
DROP TABLE IF EXISTS public.document_examples CASCADE;
DROP TABLE IF EXISTS public.document_categories CASCADE;
DROP TABLE IF EXISTS public.user_documents CASCADE;
DROP TABLE IF EXISTS public.lawyer_reviews CASCADE;
DROP TABLE IF EXISTS public.lawyer_profiles CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.promo_codes CASCADE;
DROP TABLE IF EXISTS public.platform_settings CASCADE;
DROP TABLE IF EXISTS public.processing_time_history CASCADE;
DROP TABLE IF EXISTS public.visa_processing_fees CASCADE;
DROP TABLE IF EXISTS public.visas CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Step 5: Drop custom schemas
DROP SCHEMA IF EXISTS lawyer CASCADE;
DROP SCHEMA IF EXISTS stripe CASCADE;

-- Step 6: Drop custom types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.visa_category CASCADE;
DROP TYPE IF EXISTS public.tracker_outcome CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.document_status CASCADE;
DROP TYPE IF EXISTS public.verification_status CASCADE;

-- Step 7: Clean up auth users (optional - keep this commented unless you really want to delete users)
-- DELETE FROM auth.users WHERE email NOT LIKE '%@admin.com';

-- Step 8: Recreate schemas
CREATE SCHEMA IF NOT EXISTS lawyer;
CREATE SCHEMA IF NOT EXISTS stripe;

-- Done! Now run the migrations in order to rebuild.
