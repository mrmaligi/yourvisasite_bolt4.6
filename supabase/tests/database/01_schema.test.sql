-- Test: Schema validation for core tables
-- Tests that all required tables and columns exist

begin;
select plan(30);

-- === TEST: visas table ===
SELECT has_table('public', 'visas', 'visas table exists');
SELECT has_column('public', 'visas', 'id', 'visas.id column exists');
SELECT has_column('public', 'visas', 'subclass', 'visas.subclass column exists');
SELECT has_column('public', 'visas', 'name', 'visas.name column exists');
SELECT has_column('public', 'visas', 'is_active', 'visas.is_active column exists');
SELECT col_type_is('public', 'visas', 'id', 'uuid', 'visas.id is uuid type');
SELECT col_not_null('public', 'visas', 'subclass', 'visas.subclass is not null');

-- === TEST: profiles table ===
SELECT has_table('public', 'profiles', 'profiles table exists');
SELECT has_column('public', 'profiles', 'id', 'profiles.id column exists');
SELECT has_column('public', 'profiles', 'role', 'profiles.role column exists');
SELECT has_column('public', 'profiles', 'full_name', 'profiles.full_name column exists');
SELECT has_column('public', 'profiles', 'is_verified', 'profiles.is_verified column exists');
SELECT col_type_is('public', 'profiles', 'id', 'uuid', 'profiles.id is uuid type');
SELECT col_type_is('public', 'profiles', 'role', 'text', 'profiles.role is text type');

-- === TEST: saved_visas table ===
SELECT has_table('public', 'saved_visas', 'saved_visas table exists');
SELECT has_column('public', 'saved_visas', 'user_id', 'saved_visas.user_id column exists');
SELECT has_column('public', 'saved_visas', 'visa_id', 'saved_visas.visa_id column exists');

-- === TEST: tracker_entries table ===
SELECT has_table('public', 'tracker_entries', 'tracker_entries table exists');
SELECT has_column('public', 'tracker_entries', 'visa_id', 'tracker_entries.visa_id column exists');
SELECT has_column('public', 'tracker_entries', 'submitted_by', 'tracker_entries.submitted_by column exists');
SELECT has_column('public', 'tracker_entries', 'outcome', 'tracker_entries.outcome column exists');

-- === TEST: bookings table ===
SELECT has_table('public', 'bookings', 'bookings table exists');
SELECT has_column('public', 'bookings', 'user_id', 'bookings.user_id column exists');
SELECT has_column('public', 'bookings', 'lawyer_id', 'bookings.lawyer_id column exists');
SELECT has_column('public', 'bookings', 'status', 'bookings.status column exists');

-- === TEST: auth.users table (for relationships) ===
SELECT has_table('auth', 'users', 'auth.users table exists');
SELECT has_column('auth', 'users', 'id', 'auth.users.id column exists');

-- === TEST: Extensions ===
SELECT has_extension('uuid-ossp', 'uuid-ossp extension exists');

select * from finish();
rollback;
