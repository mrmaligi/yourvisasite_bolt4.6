-- Test: RLS Policies
-- Tests that Row Level Security policies are correctly configured

begin;
select plan(15);

-- === TEST: RLS is enabled on tables ===
SELECT is(true, (SELECT relrowsecurity FROM pg_class WHERE relname = 'visas'), 'RLS enabled on visas table');
SELECT is(true, (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles'), 'RLS enabled on profiles table');
SELECT is(true, (SELECT relrowsecurity FROM pg_class WHERE relname = 'saved_visas'), 'RLS enabled on saved_visas table');
SELECT is(true, (SELECT relrowsecurity FROM pg_class WHERE relname = 'tracker_entries'), 'RLS enabled on tracker_entries table');
SELECT is(true, (SELECT relrowsecurity FROM pg_class WHERE relname = 'bookings'), 'RLS enabled on bookings table');

-- === TEST: Policies exist ===
SELECT policies_are('public', 'visas', ARRAY['Visas are viewable by everyone']);
SELECT policies_are('public', 'profiles', ARRAY['Profiles are viewable by everyone']);
SELECT policies_are('public', 'saved_visas', ARRAY['Users can manage own saved visas']);
SELECT policies_are('public', 'tracker_entries', ARRAY['Tracker entries are viewable by everyone']);
SELECT policies_are('public', 'bookings', ARRAY['Bookings viewable by participants']);

-- === TEST: Policy types ===
SELECT policy_cmd_is('public', 'visas', 'Visas are viewable by everyone', 'SELECT');
SELECT policy_cmd_is('public', 'profiles', 'Profiles are viewable by everyone', 'SELECT');
SELECT policy_cmd_is('public', 'saved_visas', 'Users can manage own saved visas', 'ALL');
SELECT policy_cmd_is('public', 'tracker_entries', 'Tracker entries are viewable by everyone', 'SELECT');
SELECT policy_cmd_is('public', 'bookings', 'Bookings viewable by participants', 'SELECT');

select * from finish();
rollback;
