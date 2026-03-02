-- ============================================
-- CHECK CURRENT POLICIES
-- ============================================

-- List all policies
SELECT 
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN qual = 'true' THEN 'ALL ROWS'
        WHEN qual LIKE '%auth.uid%' THEN 'OWN ROWS ONLY'
        ELSE qual
    END AS filter
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
