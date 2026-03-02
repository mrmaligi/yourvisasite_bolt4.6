-- Test: Foreign Key Relationships
-- Tests that all foreign key constraints are properly defined

begin;
select plan(12);

-- === TEST: profiles.id -> auth.users.id ===
SELECT fk_ok('public', 'profiles', 'id', 'auth', 'users', 'id');

-- === TEST: saved_visas.user_id -> auth.users.id ===
SELECT fk_ok('public', 'saved_visas', 'user_id', 'auth', 'users', 'id');

-- === TEST: saved_visas.visa_id -> visas.id ===
SELECT fk_ok('public', 'saved_visas', 'visa_id', 'public', 'visas', 'id');

-- === TEST: tracker_entries.visa_id -> visas.id ===
SELECT fk_ok('public', 'tracker_entries', 'visa_id', 'public', 'visas', 'id');

-- === TEST: tracker_entries.submitted_by -> auth.users.id ===
SELECT fk_ok('public', 'tracker_entries', 'submitted_by', 'auth', 'users', 'id');

-- === TEST: bookings.user_id -> auth.users.id ===
SELECT fk_ok('public', 'bookings', 'user_id', 'auth', 'users', 'id');

-- === TEST: bookings.lawyer_id -> profiles.id ===
SELECT fk_ok('public', 'bookings', 'lawyer_id', 'public', 'profiles', 'id');

-- === TEST: bookings.visa_id -> visas.id ===
SELECT fk_ok('public', 'bookings', 'visa_id', 'public', 'visas', 'id');

-- === TEST: Foreign key actions (ON DELETE) ===
SELECT col_has_default('public', 'tracker_entries', 'outcome', 'tracker_entries.outcome has default');
SELECT col_default_is('public', 'tracker_entries', 'outcome', 'pending', 'tracker_entries.outcome defaults to pending');

-- === TEST: Default values ===
SELECT col_has_default('public', 'visas', 'is_active', 'visas.is_active has default');
SELECT col_default_is('public', 'visas', 'is_active', true, 'visas.is_active defaults to true');

select * from finish();
rollback;
