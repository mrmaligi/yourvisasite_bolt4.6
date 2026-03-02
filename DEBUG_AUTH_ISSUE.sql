-- ============================================
-- DEBUG: Check for triggers and constraints on auth.users
-- ============================================

-- 1. Check for triggers on auth.users
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- 2. Check for constraints
SELECT 
    conname,
    contype,
    pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'auth.users'::regclass;

-- 3. Check if there's an RLS issue
SELECT 
    relrowsecurity,
    relforcerowsecurity
FROM pg_class
WHERE relname = 'users' AND relnamespace = 'auth'::regnamespace;
