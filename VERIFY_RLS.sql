-- ============================================
-- VERIFY RLS STATUS - Run this to check
-- ============================================

-- Check RLS status on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = n.nspname AND tablename = c.relname) AS policy_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'r' 
AND n.nspname = 'public'
AND c.relname IN ('profiles', 'saved_visas', 'bookings', 'tracker_entries', 'notifications', 'visas')
ORDER BY tablename;

-- List all policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
