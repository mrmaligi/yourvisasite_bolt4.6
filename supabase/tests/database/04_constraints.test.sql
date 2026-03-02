-- Test: Data Integrity Constraints
-- Tests unique constraints, check constraints, and not null constraints

begin;
select plan(10);

-- === TEST: Unique constraints ===
SELECT col_is_unique('public', 'visas', 'subclass', 'visas.subclass is unique');
SELECT col_is_unique('public', 'saved_visas', ARRAY['user_id', 'visa_id'], 'saved_visas (user_id, visa_id) is unique');

-- === TEST: Primary keys ===
SELECT col_is_pk('public', 'visas', 'id', 'visas.id is primary key');
SELECT col_is_pk('public', 'profiles', 'id', 'profiles.id is primary key');
SELECT col_is_pk('public', 'saved_visas', 'id', 'saved_visas.id is primary key');
SELECT col_is_pk('public', 'tracker_entries', 'id', 'tracker_entries.id is primary key');
SELECT col_is_pk('public', 'bookings', 'id', 'bookings.id is primary key');

-- === TEST: Not null constraints on critical columns ===
SELECT col_not_null('public', 'visas', 'name', 'visas.name is not null');
SELECT col_not_null('public', 'bookings', 'booking_date', 'bookings.booking_date is not null');
SELECT col_not_null('public', 'tracker_entries', 'application_date', 'tracker_entries.application_date is not null');

select * from finish();
rollback;
