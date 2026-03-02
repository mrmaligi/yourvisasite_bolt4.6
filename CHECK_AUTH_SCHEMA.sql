-- ============================================
-- CHECK AUTH.USERS SCHEMA
-- ============================================

-- Check what columns auth.users has
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
AND table_name = 'users'
ORDER BY ordinal_position;
