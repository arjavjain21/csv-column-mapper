-- Quick verification queries to check if migration was successful
-- Run these in Supabase SQL Editor to verify tables exist

-- Check if all main tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles',
    'mappings',
    'mapping_versions',
    'templates',
    'teams',
    'team_members',
    'subscription_periods',
    'usage_records',
    'sales_leads'
)
ORDER BY table_name;

-- Check if RLS is enabled on all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'user_profiles',
    'mappings',
    'mapping_versions',
    'templates',
    'teams',
    'team_members',
    'subscription_periods',
    'usage_records',
    'sales_leads'
)
ORDER BY tablename;

-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'handle_new_user',
    'get_or_create_subscription_period',
    'get_user_quota_status',
    'check_quota_limit',
    'update_updated_at_column'
)
ORDER BY routine_name;

-- Check if triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
