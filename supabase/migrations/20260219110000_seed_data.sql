-- Seed Data Migration
-- Creates 30 mock users (10 regular, 10 lawyers, 10 admins) and associated data.

-- Ensure pgcrypto is available for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id uuid;
  v_lawyer_id uuid;
  v_lawyer_profile_id uuid;
  v_admin_id uuid;
  v_visa_id uuid;
  v_listing_id uuid;
  v_purchase_id uuid;
  v_slot_id uuid;
  v_article_id uuid;
  v_doc_category text;

  -- Arrays to store created IDs for later use
  v_user_ids uuid[] := ARRAY[]::uuid[];
  v_lawyer_ids uuid[] := ARRAY[]::uuid[];
  v_lawyer_profile_ids uuid[] := ARRAY[]::uuid[];
  v_admin_ids uuid[] := ARRAY[]::uuid[];
  v_visa_ids uuid[] := ARRAY[]::uuid[];

  -- Loop variables
  i integer;
  j integer;

  -- Constants
  c_password_hash text := crypt('TestPass123!', gen_salt('bf'));

  -- Temporary variables
  v_practice_areas text[];
  v_start_time timestamptz;

BEGIN
  -- =================================================================
  -- 1. SEED REGULAR USERS (10)
  -- =================================================================
  RAISE NOTICE 'Seeding 10 Regular Users...';

  FOR i IN 1..10 LOOP
    -- Check if user exists, else create
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'user' || i || '@visabuild.test';

    IF v_user_id IS NULL THEN
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
        'user' || i || '@visabuild.test', c_password_hash, now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object(
          'full_name', (ARRAY['Sarah Chen', 'James Wilson', 'Priya Patel', 'Mohammed Al-Hassan', 'Emma Thompson', 'Carlos Rodriguez', 'Yuki Tanaka', 'Fatima Ahmed', 'Liam O Brien', 'Sofia Rossi'])[i],
          'avatar_url', 'https://ui-avatars.com/api/?name=' || replace((ARRAY['Sarah Chen', 'James Wilson', 'Priya Patel', 'Mohammed Al-Hassan', 'Emma Thompson', 'Carlos Rodriguez', 'Yuki Tanaka', 'Fatima Ahmed', 'Liam O Brien', 'Sofia Rossi'])[i], ' ', '+') || '&background=random&size=200'
        ),
        now(), now(), '', ''
      ) RETURNING id INTO v_user_id;
    END IF;

    -- Add to array
    v_user_ids := array_append(v_user_ids, v_user_id);

    -- Update public.profiles (created by trigger, but we ensure details)
    UPDATE public.profiles
    SET
      full_name = (ARRAY['Sarah Chen', 'James Wilson', 'Priya Patel', 'Mohammed Al-Hassan', 'Emma Thompson', 'Carlos Rodriguez', 'Yuki Tanaka', 'Fatima Ahmed', 'Liam O Brien', 'Sofia Rossi'])[i],
      avatar_url = 'https://ui-avatars.com/api/?name=' || replace((ARRAY['Sarah Chen', 'James Wilson', 'Priya Patel', 'Mohammed Al-Hassan', 'Emma Thompson', 'Carlos Rodriguez', 'Yuki Tanaka', 'Fatima Ahmed', 'Liam O Brien', 'Sofia Rossi'])[i], ' ', '+') || '&background=random&size=200',
      phone = '+61 4' || floor(random() * 90 + 10)::text || ' ' || floor(random() * 900 + 100)::text || ' ' || floor(random() * 900 + 100)::text,
      bio = 'Aspiring immigrant looking to build a new life in Australia.',
      role = 'user'
    WHERE id = v_user_id;

  END LOOP;

  -- =================================================================
  -- 2. SEED LAWYERS (10)
  -- =================================================================
  RAISE NOTICE 'Seeding 10 Lawyers...';

  FOR i IN 1..10 LOOP
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'lawyer' || i || '@visabuild.test';

    IF v_user_id IS NULL THEN
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
        'lawyer' || i || '@visabuild.test', c_password_hash, now(),
        '{"provider":"email","providers":["email"],"role":"lawyer"}'::jsonb,
        jsonb_build_object(
          'full_name', (ARRAY['Dr. Amanda Hayes', 'Barrister Raj Kapoor', 'Sarah Mitchell LLB', 'David Park', 'Maria Santos', 'Thomas Wright', 'Aisha Khan', 'Robert Chen', 'Jennifer Adams', 'Michael Brown'])[i],
          'avatar_url', 'https://ui-avatars.com/api/?name=' || replace((ARRAY['Dr. Amanda Hayes', 'Barrister Raj Kapoor', 'Sarah Mitchell LLB', 'David Park', 'Maria Santos', 'Thomas Wright', 'Aisha Khan', 'Robert Chen', 'Jennifer Adams', 'Michael Brown'])[i], ' ', '+') || '&background=random&size=200'
        ),
        now(), now(), '', ''
      ) RETURNING id INTO v_user_id;
    END IF;

    v_lawyer_ids := array_append(v_lawyer_ids, v_user_id);

    -- Assign practice areas
    v_practice_areas := CASE (i % 5)
      WHEN 0 THEN ARRAY['Skilled Migration', 'Employer Sponsored']
      WHEN 1 THEN ARRAY['Family Visas', 'Partner Visas']
      WHEN 2 THEN ARRAY['Business Innovation', 'Investor Visas']
      WHEN 3 THEN ARRAY['Student Visas', 'Graduate Visas']
      ELSE ARRAY['Refugee', 'Protection Visas']
    END;

    -- Update public.profiles with lawyer fields
    UPDATE public.profiles
    SET
      full_name = (ARRAY['Dr. Amanda Hayes', 'Barrister Raj Kapoor', 'Sarah Mitchell LLB', 'David Park', 'Maria Santos', 'Thomas Wright', 'Aisha Khan', 'Robert Chen', 'Jennifer Adams', 'Michael Brown'])[i],
      avatar_url = 'https://ui-avatars.com/api/?name=' || replace((ARRAY['Dr. Amanda Hayes', 'Barrister Raj Kapoor', 'Sarah Mitchell LLB', 'David Park', 'Maria Santos', 'Thomas Wright', 'Aisha Khan', 'Robert Chen', 'Jennifer Adams', 'Michael Brown'])[i], ' ', '+') || '&background=random&size=200',
      phone = '+61 4' || floor(random() * 90 + 10)::text || ' ' || floor(random() * 900 + 100)::text || ' ' || floor(random() * 900 + 100)::text,
      bio = 'Experienced immigration lawyer specializing in ' || v_practice_areas[1] || '.',
      role = 'lawyer',
      bar_number = 'AU-' || floor(random() * 90000 + 10000)::text,
      jurisdiction = (ARRAY['NSW', 'VIC', 'QLD', 'WA', 'SA'])[floor(random()*5 + 1)::int],
      practice_areas = v_practice_areas,
      years_experience = floor(random() * 20 + 5)::int,
      hourly_rate_cents = floor(random() * 35000 + 15000)::int,
      is_verified = true,
      verification_status = 'approved',
      verified_at = now()
    WHERE id = v_user_id;

    -- Upsert into lawyer.profiles (for FK references)
    -- Check if exists
    SELECT id INTO v_lawyer_profile_id FROM lawyer.profiles WHERE profile_id = v_user_id;

    IF v_lawyer_profile_id IS NULL THEN
      INSERT INTO lawyer.profiles (profile_id, is_verified, verification_status)
      VALUES (v_user_id, true, 'approved')
      RETURNING id INTO v_lawyer_profile_id;
    END IF;

    -- Sync fields from public.profiles to lawyer.profiles just in case (though we rely on public.profiles mostly now)
    UPDATE lawyer.profiles
    SET
      bar_number = (SELECT bar_number FROM public.profiles WHERE id = v_user_id),
      jurisdiction = (SELECT jurisdiction FROM public.profiles WHERE id = v_user_id),
      practice_areas = (SELECT practice_areas FROM public.profiles WHERE id = v_user_id),
      years_experience = (SELECT years_experience FROM public.profiles WHERE id = v_user_id),
      bio = (SELECT bio FROM public.profiles WHERE id = v_user_id),
      hourly_rate_cents = (SELECT hourly_rate_cents FROM public.profiles WHERE id = v_user_id)
    WHERE id = v_lawyer_profile_id;

    v_lawyer_profile_ids := array_append(v_lawyer_profile_ids, v_lawyer_profile_id);

  END LOOP;

  -- =================================================================
  -- 3. SEED ADMINS (10)
  -- =================================================================
  RAISE NOTICE 'Seeding 10 Admins...';

  FOR i IN 1..10 LOOP
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin' || i || '@visabuild.test';

    IF v_user_id IS NULL THEN
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
        'admin' || i || '@visabuild.test', c_password_hash, now(),
        '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
        jsonb_build_object(
          'full_name', (ARRAY['Alex Admin', 'System Moderator', 'Content Manager', 'Support Lead', 'Tech Ops', 'Policy Expert', 'Community Manager', 'Data Analyst', 'Quality Assurance', 'Security Officer'])[i],
          'avatar_url', 'https://ui-avatars.com/api/?name=' || replace((ARRAY['Alex Admin', 'System Moderator', 'Content Manager', 'Support Lead', 'Tech Ops', 'Policy Expert', 'Community Manager', 'Data Analyst', 'Quality Assurance', 'Security Officer'])[i], ' ', '+') || '&background=random&size=200'
        ),
        now(), now(), '', ''
      ) RETURNING id INTO v_user_id;
    END IF;

    v_admin_ids := array_append(v_admin_ids, v_user_id);

    UPDATE public.profiles
    SET
      role = 'admin',
      full_name = (ARRAY['Alex Admin', 'System Moderator', 'Content Manager', 'Support Lead', 'Tech Ops', 'Policy Expert', 'Community Manager', 'Data Analyst', 'Quality Assurance', 'Security Officer'])[i],
      avatar_url = 'https://ui-avatars.com/api/?name=' || replace((ARRAY['Alex Admin', 'System Moderator', 'Content Manager', 'Support Lead', 'Tech Ops', 'Policy Expert', 'Community Manager', 'Data Analyst', 'Quality Assurance', 'Security Officer'])[i], ' ', '+') || '&background=random&size=200'
    WHERE id = v_user_id;

  END LOOP;

  -- =================================================================
  -- 4. SEED USER DATA (Saved Visas, Docs, Tracker, Purchases)
  -- =================================================================
  RAISE NOTICE 'Seeding User Data...';

  -- Fetch all visa IDs
  SELECT array_agg(id) INTO v_visa_ids FROM public.visas;

  IF array_length(v_visa_ids, 1) > 0 THEN
    FOREACH v_user_id IN ARRAY v_user_ids LOOP
      -- 4.1 Saved Visas (2-3 per user)
      FOR j IN 1..(floor(random() * 2 + 2)::int) LOOP
        v_visa_id := v_visa_ids[floor(random() * array_length(v_visa_ids, 1) + 1)::int];
        INSERT INTO public.saved_visas (user_id, visa_id)
        VALUES (v_user_id, v_visa_id)
        ON CONFLICT (user_id, visa_id) DO NOTHING;
      END LOOP;

      -- 4.2 Documents (1-2 per user)
      FOR j IN 1..(floor(random() * 2 + 1)::int) LOOP
        v_doc_category := (ARRAY['passport', 'birth_certificate', 'police_check', 'english_test'])[floor(random()*4 + 1)::int];
        -- Check if exists to avoid duplicates
        IF NOT EXISTS (SELECT 1 FROM public.user_documents WHERE user_id = v_user_id AND file_name = v_doc_category || '.pdf') THEN
          INSERT INTO public.user_documents (user_id, visa_id, document_category, file_name, storage_path, status)
          VALUES (
            v_user_id,
            v_visa_ids[floor(random() * array_length(v_visa_ids, 1) + 1)::int],
            v_doc_category,
            v_doc_category || '.pdf',
            v_user_id || '/' || v_doc_category || '.pdf',
            'pending'
          );
        END IF;
      END LOOP;

      -- 4.3 Tracker Entries (1 per user)
      v_visa_id := v_visa_ids[floor(random() * array_length(v_visa_ids, 1) + 1)::int];
      -- Check existence
      IF NOT EXISTS (SELECT 1 FROM public.tracker_entries WHERE submitted_by = v_user_id AND visa_id = v_visa_id) THEN
        INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight)
        VALUES (
          v_visa_id,
          v_user_id,
          'user',
          now() - interval '6 months',
          now() - interval '1 month',
          150,
          'approved',
          1.0
        );
      END IF;

    END LOOP;

    -- 4.4 Purchases (3 users)
    FOR j IN 1..3 LOOP
      v_user_id := v_user_ids[j];
      v_visa_id := v_visa_ids[floor(random() * array_length(v_visa_ids, 1) + 1)::int];
      INSERT INTO public.user_visa_purchases (user_id, visa_id, amount_cents, payment_provider, payment_id)
      VALUES (v_user_id, v_visa_id, 4900, 'stripe', 'pi_mock_' || floor(random() * 100000)::text)
      ON CONFLICT (user_id, visa_id) DO NOTHING;
    END LOOP;
  END IF;

  -- =================================================================
  -- 5. SEED LAWYER DATA (Slots, Bookings, Tracker)
  -- =================================================================
  RAISE NOTICE 'Seeding Lawyer Data...';

  -- 5.1 Consultation Slots (5 lawyers)
  FOR i IN 1..5 LOOP
    v_lawyer_profile_id := v_lawyer_profile_ids[i];

    -- Create slots for next 5 days, 9am-5pm
    FOR j IN 1..5 LOOP -- 5 days
      -- Insert 3 slots per day
      -- Slot 1: 09:00-10:00
      v_start_time := now() + (j || ' days')::interval + '09:00:00';
      IF NOT EXISTS (SELECT 1 FROM lawyer.consultation_slots WHERE lawyer_id = v_lawyer_profile_id AND start_time = v_start_time) THEN
        INSERT INTO lawyer.consultation_slots (lawyer_id, start_time, end_time, is_booked)
        VALUES (v_lawyer_profile_id, v_start_time, v_start_time + interval '1 hour', false);
      END IF;

      -- Slot 2: 13:00-14:00
      v_start_time := now() + (j || ' days')::interval + '13:00:00';
      IF NOT EXISTS (SELECT 1 FROM lawyer.consultation_slots WHERE lawyer_id = v_lawyer_profile_id AND start_time = v_start_time) THEN
        INSERT INTO lawyer.consultation_slots (lawyer_id, start_time, end_time, is_booked)
        VALUES (v_lawyer_profile_id, v_start_time, v_start_time + interval '1 hour', false);
      END IF;

      -- Slot 3: 16:00-17:00
      v_start_time := now() + (j || ' days')::interval + '16:00:00';
      IF NOT EXISTS (SELECT 1 FROM lawyer.consultation_slots WHERE lawyer_id = v_lawyer_profile_id AND start_time = v_start_time) THEN
        INSERT INTO lawyer.consultation_slots (lawyer_id, start_time, end_time, is_booked)
        VALUES (v_lawyer_profile_id, v_start_time, v_start_time + interval '1 hour', false);
      END IF;
    END LOOP;
  END LOOP;

  -- 5.2 Active Bookings (3 lawyers, 2 users)
  FOR i IN 1..2 LOOP
    v_user_id := v_user_ids[i];
    v_lawyer_profile_id := v_lawyer_profile_ids[i];

    -- Check if booking exists
    IF NOT EXISTS (SELECT 1 FROM public.bookings WHERE user_id = v_user_id AND lawyer_id = v_lawyer_profile_id) THEN
      -- Find a slot that is not booked
      SELECT id INTO v_slot_id FROM lawyer.consultation_slots
      WHERE lawyer_id = v_lawyer_profile_id AND is_booked = false LIMIT 1;

      IF v_slot_id IS NOT NULL THEN
        -- Mark as booked
        UPDATE lawyer.consultation_slots SET is_booked = true WHERE id = v_slot_id;

        -- Create booking
        INSERT INTO public.bookings (user_id, lawyer_id, slot_id, duration_minutes, total_price_cents, status, notes)
        VALUES (
          v_user_id,
          v_lawyer_profile_id,
          v_slot_id,
          60,
          20000,
          'confirmed',
          'Looking forward to discussing my visa options.'
        );
      END IF;
    END IF;
  END LOOP;

  -- 5.3 Lawyer Tracker Entries (2-3 per lawyer)
  FOREACH v_user_id IN ARRAY v_lawyer_ids LOOP
    FOR j IN 1..(floor(random() * 2 + 2)::int) LOOP
      v_visa_id := v_visa_ids[floor(random() * array_length(v_visa_ids, 1) + 1)::int];
      -- Check existence
      IF NOT EXISTS (SELECT 1 FROM public.tracker_entries WHERE submitted_by = v_user_id AND visa_id = v_visa_id) THEN
        INSERT INTO public.tracker_entries (visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight)
        VALUES (
          v_visa_id,
          v_user_id,
          'lawyer',
          now() - interval '8 months',
          now() - interval '2 months',
          180,
          'approved',
          1.5
        );
      END IF;
    END LOOP;
  END LOOP;

  -- =================================================================
  -- 6. SEED CONTENT (News, Marketplace)
  -- =================================================================
  RAISE NOTICE 'Seeding Content...';

  -- 6.1 News Articles (5 total: 2 by admin, 3 by lawyers)
  -- Admins
  FOR i IN 1..2 LOOP
    INSERT INTO public.news_articles (title, slug, body, author_id, is_published, published_at, image_url)
    VALUES (
      'Immigration Policy Update ' || i,
      'immigration-policy-update-' || i,
      'This is a major update to immigration policy. Details regarding skilled migration changes...',
      v_admin_ids[1],
      true,
      now() - (i || ' days')::interval,
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80'
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_article_id;

    -- If article already exists, get ID
    IF v_article_id IS NULL THEN
      SELECT id INTO v_article_id FROM public.news_articles WHERE slug = 'immigration-policy-update-' || i;
    END IF;

    -- Comments
    IF v_article_id IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM public.news_comments WHERE article_id = v_article_id AND author_id = v_user_ids[1]) THEN
        INSERT INTO public.news_comments (article_id, author_id, body)
        VALUES (v_article_id, v_user_ids[1], 'Great update, thanks for sharing!');
      END IF;
    END IF;
  END LOOP;

  -- Lawyers
  FOR i IN 1..3 LOOP
    INSERT INTO public.news_articles (title, slug, body, author_id, is_published, published_at, image_url)
    VALUES (
      'Visa Processing Times Analysis ' || i,
      'visa-processing-times-analysis-' || i,
      'We have analyzed the latest processing times and found significant improvements...',
      v_lawyer_ids[i],
      true,
      now() - (i || ' days')::interval,
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80'
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_article_id;

    IF v_article_id IS NULL THEN
      SELECT id INTO v_article_id FROM public.news_articles WHERE slug = 'visa-processing-times-analysis-' || i;
    END IF;

     -- Comments
    IF v_article_id IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM public.news_comments WHERE article_id = v_article_id AND author_id = v_user_ids[2]) THEN
        INSERT INTO public.news_comments (article_id, author_id, body)
        VALUES (v_article_id, v_user_ids[2], 'Very helpful analysis.');
      END IF;
    END IF;
  END LOOP;

  -- 6.2 Marketplace Listings (5 by lawyers)
  FOR i IN 1..5 LOOP
    v_lawyer_profile_id := v_lawyer_profile_ids[i];

    -- Check if listing exists (using title and lawyer_id as proxy for uniqueness)
    SELECT id INTO v_listing_id FROM lawyer.marketplace_listings
    WHERE lawyer_id = v_lawyer_profile_id AND title = 'Visa Consultation Package ' || i LIMIT 1;

    IF v_listing_id IS NULL THEN
      INSERT INTO lawyer.marketplace_listings (
        lawyer_id, title, description, short_description, price_cents, listing_type, duration_minutes, is_active
      ) VALUES (
        v_lawyer_profile_id,
        'Visa Consultation Package ' || i,
        'Comprehensive consultation package including document review and strategy session.',
        'Comprehensive consultation package',
        15000,
        'service',
        60,
        true
      ) RETURNING id INTO v_listing_id;
    END IF;

    -- 6.3 Reviews (3 reviews)
    IF i <= 3 THEN
      -- Check if purchase exists
      SELECT id INTO v_purchase_id FROM marketplace_purchases
      WHERE user_id = v_user_ids[i] AND listing_id = v_listing_id LIMIT 1;

      IF v_purchase_id IS NULL THEN
        INSERT INTO marketplace_purchases (user_id, listing_id, lawyer_id, amount_cents, status, completed_at)
        VALUES (v_user_ids[i], v_listing_id, v_lawyer_profile_id, 15000, 'completed', now())
        RETURNING id INTO v_purchase_id;
      END IF;

      -- Create review
      IF NOT EXISTS (SELECT 1 FROM marketplace_reviews WHERE purchase_id = v_purchase_id) THEN
        INSERT INTO marketplace_reviews (listing_id, purchase_id, user_id, lawyer_id, rating, title, comment)
        VALUES (
          v_listing_id,
          v_purchase_id,
          v_user_ids[i],
          v_lawyer_profile_id,
          5,
          'Excellent Service',
          'The lawyer was very professional and helpful.'
        );
      END IF;
    END IF;
  END LOOP;

  -- =================================================================
  -- 7. REFRESH STATS
  -- =================================================================
  RAISE NOTICE 'Refreshing Stats...';
  -- Assuming there is a function or trigger, otherwise manual update

END $$;
