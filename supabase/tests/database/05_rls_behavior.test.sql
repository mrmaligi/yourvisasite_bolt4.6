-- Test: RLS Policy Behavior
-- Tests that RLS policies actually work as expected

begin;
select plan(8);

-- Create test users
insert into auth.users (id, email, raw_user_meta_data)
values 
  ('11111111-1111-1111-1111-111111111111', 'user1@test.com', '{"full_name": "User One"}'),
  ('22222222-2222-2222-2222-222222222222', 'user2@test.com', '{"full_name": "User Two"}');

-- Create test profiles
insert into public.profiles (id, role, full_name)
values 
  ('11111111-1111-1111-1111-111111111111', 'user', 'User One'),
  ('22222222-2222-2222-2222-222222222222', 'lawyer', 'User Two');

-- Create test visa
insert into public.visas (id, subclass, name, is_active)
values ('33333333-3333-3333-3333-333333333333', '189', 'Skilled Independent', true);

-- === TEST: Everyone can view visas ===
SET LOCAL ROLE postgres;
SELECT results_eq(
  'SELECT count(*) FROM public.visas WHERE subclass = ''189''',
  ARRAY[1::bigint],
  'Visas are viewable by everyone'
);

-- === TEST: Everyone can view profiles ===
SELECT results_eq(
  'SELECT count(*) FROM public.profiles',
  ARRAY[2::bigint],
  'Profiles are viewable by everyone'
);

-- === TEST: Everyone can view tracker entries ===
-- First add a tracker entry
insert into public.tracker_entries (visa_id, submitted_by, application_date, outcome)
values ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '2024-01-01', 'approved');

SELECT results_eq(
  'SELECT count(*) FROM public.tracker_entries',
  ARRAY[1::bigint],
  'Tracker entries are viewable by everyone'
);

-- === TEST: Users can only see their own saved visas ===
insert into public.saved_visas (user_id, visa_id)
values 
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');

-- As user 1, should only see 1 saved visa
SET LOCAL auth.uid = '11111111-1111-1111-1111-111111111111';
SELECT results_eq(
  'SELECT count(*) FROM public.saved_visas',
  ARRAY[1::bigint],
  'User can only see their own saved visas'
);

-- As user 2, should only see 1 saved visa (their own)
SET LOCAL auth.uid = '22222222-2222-2222-2222-222222222222';
SELECT results_eq(
  'SELECT count(*) FROM public.saved_visas',
  ARRAY[1::bigint],
  'User 2 can only see their own saved visas'
);

-- === TEST: Users can only see their own bookings ===
insert into public.bookings (user_id, lawyer_id, visa_id, booking_date, start_time, end_time, status)
values 
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '2024-12-01', '09:00', '10:00', 'pending'),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '2024-12-02', '10:00', '11:00', 'confirmed');

SET LOCAL auth.uid = '11111111-1111-1111-1111-111111111111';
SELECT results_eq(
  'SELECT count(*) FROM public.bookings',
  ARRAY[1::bigint],
  'User can only see their own bookings'
);

-- As user 2, should only see their own booking
SET LOCAL auth.uid = '22222222-2222-2222-2222-222222222222';
SELECT results_eq(
  'SELECT count(*) FROM public.bookings',
  ARRAY[1::bigint],
  'User 2 can only see their own bookings'
);

-- === TEST: Users can insert their own saved visas ===
SET LOCAL auth.uid = '11111111-1111-1111-1111-111111111111';
SELECT lives_ok(
  'INSERT INTO public.saved_visas (user_id, visa_id) VALUES (''11111111-1111-1111-1111-111111111111'', ''33333333-3333-3333-3333-333333333333'') ON CONFLICT DO NOTHING',
  'User can insert their own saved visa'
);

-- === TEST: Users cannot insert other users saved visas ===
SELECT throws_ok(
  'INSERT INTO public.saved_visas (user_id, visa_id) VALUES (''22222222-2222-2222-2222-222222222222'', ''33333333-3333-3333-3333-333333333333'')',
  'new row violates row-level security policy for table "saved_visas"',
  'User cannot insert saved visa for another user'
);

select * from finish();
rollback;
