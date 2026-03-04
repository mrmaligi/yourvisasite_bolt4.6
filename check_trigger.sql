-- Check the current trigger function
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check if there are any default values causing auto-approval
SELECT column_name, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('verification_status', 'is_verified', 'role');
