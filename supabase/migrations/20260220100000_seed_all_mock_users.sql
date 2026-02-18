CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Migration to fix and seed all mock users
DO $$
DECLARE
  v_user_id uuid;
  v_profile_id uuid;
  v_lawyer_profile_id uuid;
  v_visa_ids uuid[];
  v_category_ids uuid[];
  v_listing_ids uuid[];
  v_article_ids uuid[];
  v_purchase_ids uuid[];
  i integer;
  j integer;

  -- User Data Arrays
  v_user_names text[] := ARRAY[
    'Sarah Chen', 'James Wilson', 'Priya Patel', 'Mohammed Al-Hassan', 'Emma Thompson',
    'Carlos Rodriguez', 'Yuki Tanaka', 'Fatima Ahmed', 'Liam OBrien', 'Sofia Rossi'
  ];

  v_lawyer_names text[] := ARRAY[
    'Dr Amanda Hayes', 'Barrister Raj Kapoor', 'Sarah Mitchell LLB', 'David Park', 'Maria Santos',
    'Thomas Wright', 'Aisha Khan', 'Robert Chen', 'Jennifer Adams', 'Michael Brown'
  ];

  v_admin_names text[] := ARRAY[
    'Alex Admin', 'System Moderator', 'Content Manager', 'Support Lead', 'Security Admin',
    'Data Admin', 'User Admin', 'Finance Admin', 'Tech Admin', 'Super Admin'
  ];

  -- Lawyer Data Arrays
  v_jurisdictions text[] := ARRAY['NSW', 'VIC', 'QLD', 'WA', 'SA', 'NSW', 'VIC', 'QLD', 'WA', 'SA'];

  -- Helper for practice areas (can't easily use 2D array indexing for rows in PL/PGSQL)
  v_current_practice_areas text[];

  -- Helper function to generate phone
  v_phone text;

  -- Helper for random selection
  v_random_visa_id uuid;
  v_random_lawyer_id uuid;

  -- Track created IDs
  v_created_lawyer_ids uuid[] := ARRAY[]::uuid[];
  v_created_user_ids uuid[] := ARRAY[]::uuid[];
  v_created_admin_ids uuid[] := ARRAY[]::uuid[];

BEGIN
  -- Get some valid visa IDs for references
  SELECT ARRAY_AGG(id) INTO v_visa_ids FROM (SELECT id FROM public.visas LIMIT 20) t;

  -- If no visas exist, we can't properly seed linked data, but we'll proceed with users
  IF v_visa_ids IS NULL THEN
    RAISE NOTICE 'No visas found, skipping visa-related seeding';
  END IF;

  ---------------------------------------------------------------------------
  -- 1. SEED REGULAR USERS (10)
  ---------------------------------------------------------------------------
  FOR i IN 1..10 LOOP
    -- Generate Email and Phone
    v_phone := '+61 4' || lpad((floor(random() * 100)::text), 2, '0') || ' ' || lpad((floor(random() * 1000)::text), 3, '0') || ' ' || lpad((floor(random() * 1000)::text), 3, '0');

    -- Insert/Update Auth User
    -- We use a fixed UUID generation strategy or look up by email to ensure idempotency
    -- Here we rely on email lookup

    -- Check if user exists
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'user' || i || '@visabuild.test';

    IF v_user_id IS NULL THEN
      v_user_id := gen_random_uuid();
      INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
      ) VALUES (
        v_user_id,
        'user' || i || '@visabuild.test',
        crypt('TestPass123!', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('full_name', v_user_names[i]),
        'authenticated',
        'authenticated'
      );
    ELSE
      -- Update password and metadata
      UPDATE auth.users SET
        encrypted_password = crypt('TestPass123!', gen_salt('bf')),
        raw_user_meta_data = jsonb_build_object('full_name', v_user_names[i]),
        updated_at = now()
      WHERE id = v_user_id;
    END IF;

    v_created_user_ids := array_append(v_created_user_ids, v_user_id);

    -- Upsert Public Profile
    INSERT INTO public.profiles (
      id, role, full_name, avatar_url, phone, bio, is_active
    ) VALUES (
      v_user_id,
      'user',
      v_user_names[i],
      'https://ui-avatars.com/api/?name=' || replace(v_user_names[i], ' ', '+') || '&background=random',
      v_phone,
      'I am ' || v_user_names[i] || ', looking for visa advice.',
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role,
      full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url,
      phone = EXCLUDED.phone,
      bio = EXCLUDED.bio,
      is_active = EXCLUDED.is_active;

    -- Seed Saved Visas (2-3)
    IF v_visa_ids IS NOT NULL THEN
      DELETE FROM public.saved_visas WHERE user_id = v_user_id; -- Clean up for idempotency
      FOR j IN 1..(2 + floor(random() * 2)::int) LOOP
        v_random_visa_id := v_visa_ids[1 + floor(random() * array_length(v_visa_ids, 1))::int];
        INSERT INTO public.saved_visas (user_id, visa_id)
        VALUES (v_user_id, v_random_visa_id)
        ON CONFLICT (user_id, visa_id) DO NOTHING;
      END LOOP;
    END IF;

    -- Seed User Documents (1-2)
    IF v_visa_ids IS NOT NULL THEN
       -- Clear old docs? Maybe not, just add if missing. But requirement is "Each has 1-2".
       -- We'll delete for clean slate on seed.
       DELETE FROM public.user_documents WHERE user_id = v_user_id AND file_name LIKE 'seed_%';
       FOR j IN 1..(1 + floor(random() * 2)::int) LOOP
         v_random_visa_id := v_visa_ids[1 + floor(random() * array_length(v_visa_ids, 1))::int];
         INSERT INTO public.user_documents (
           user_id, visa_id, document_category, file_name, storage_path, status
         ) VALUES (
           v_user_id,
           v_random_visa_id,
           'identity',
           'seed_passport_' || j || '.pdf',
           v_user_id || '/seed_passport_' || j || '.pdf',
           'pending'
         );
       END LOOP;
    END IF;

    -- Seed Tracker Entries (1)
    IF v_visa_ids IS NOT NULL THEN
      DELETE FROM public.tracker_entries WHERE submitted_by = v_user_id;
      v_random_visa_id := v_visa_ids[1 + floor(random() * array_length(v_visa_ids, 1))::int];
      INSERT INTO public.tracker_entries (
        visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight
      ) VALUES (
        v_random_visa_id,
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

  ---------------------------------------------------------------------------
  -- 2. SEED LAWYERS (10)
  ---------------------------------------------------------------------------
  FOR i IN 1..10 LOOP
    -- Set practice areas based on index
    CASE i
      WHEN 1 THEN v_current_practice_areas := ARRAY['Immigration Law', 'Visa Appeals'];
      WHEN 2 THEN v_current_practice_areas := ARRAY['Business Visas', 'Corporate Law'];
      WHEN 3 THEN v_current_practice_areas := ARRAY['Family Law', 'Partner Visas'];
      WHEN 4 THEN v_current_practice_areas := ARRAY['Skilled Migration', 'Work Visas'];
      WHEN 5 THEN v_current_practice_areas := ARRAY['Student Visas', 'Graduate Visas'];
      WHEN 6 THEN v_current_practice_areas := ARRAY['Refugee Law', 'Humanitarian Visas'];
      WHEN 7 THEN v_current_practice_areas := ARRAY['Citizenship', 'Residency'];
      WHEN 8 THEN v_current_practice_areas := ARRAY['Employer Sponsored Visas', 'Labour Agreements'];
      WHEN 9 THEN v_current_practice_areas := ARRAY['Visitor Visas', 'Bridging Visas'];
      WHEN 10 THEN v_current_practice_areas := ARRAY['Complex Cases', 'Tribunal Review'];
      ELSE v_current_practice_areas := ARRAY['General Immigration'];
    END CASE;

    -- Check if user exists
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'lawyer' || i || '@visabuild.test';

    IF v_user_id IS NULL THEN
      v_user_id := gen_random_uuid();
      INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
      ) VALUES (
        v_user_id,
        'lawyer' || i || '@visabuild.test',
        crypt('TestPass123!', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('full_name', v_lawyer_names[i]),
        'authenticated',
        'authenticated'
      );
    ELSE
      UPDATE auth.users SET
        encrypted_password = crypt('TestPass123!', gen_salt('bf')),
        raw_user_meta_data = jsonb_build_object('full_name', v_lawyer_names[i]),
        updated_at = now()
      WHERE id = v_user_id;
    END IF;

    v_created_lawyer_ids := array_append(v_created_lawyer_ids, v_user_id);

    -- Upsert Public Profile (with lawyer details in public profile too as per recent migration)
    -- We assume columns bar_number, jurisdiction, practice_areas, etc. exist in public.profiles
    -- based on previous migrations (20260219100000_fix_lawyer_and_storage.sql)
    INSERT INTO public.profiles (
      id, role, full_name, avatar_url, phone, bio, is_active,
      bar_number, jurisdiction, practice_areas, years_experience, hourly_rate_cents,
      is_verified, verification_status, verified_at
    ) VALUES (
      v_user_id,
      'lawyer',
      v_lawyer_names[i],
      'https://ui-avatars.com/api/?name=' || replace(v_lawyer_names[i], ' ', '+') || '&background=random',
      '+61 400 000 ' || lpad(i::text, 3, '0'),
      'Experienced lawyer specializing in ' || v_current_practice_areas[1],
      true,
      'AU-' || (10000 + i)::text,
      v_jurisdictions[i],
      v_current_practice_areas,
      5 + floor(random() * 20)::int,
      15000 + floor(random() * 35000)::int,
      true,
      'approved',
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role,
      full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url,
      phone = EXCLUDED.phone,
      bio = EXCLUDED.bio,
      is_active = EXCLUDED.is_active,
      bar_number = EXCLUDED.bar_number,
      jurisdiction = EXCLUDED.jurisdiction,
      practice_areas = EXCLUDED.practice_areas,
      years_experience = EXCLUDED.years_experience,
      hourly_rate_cents = EXCLUDED.hourly_rate_cents,
      is_verified = EXCLUDED.is_verified,
      verification_status = EXCLUDED.verification_status,
      verified_at = EXCLUDED.verified_at;

    -- Upsert Lawyer Profile (Old Schema) - Required for FKs
    -- First check if exists to get ID or Insert
    INSERT INTO lawyer.profiles (
      profile_id, bar_number, jurisdiction, practice_areas, years_experience, bio, hourly_rate_cents,
      is_verified, verification_status, verified_at
    ) VALUES (
      v_user_id,
      'AU-' || (10000 + i)::text,
      v_jurisdictions[i],
      v_current_practice_areas,
      5 + floor(random() * 20)::int,
      'Experienced lawyer specializing in ' || v_current_practice_areas[1],
      15000 + floor(random() * 35000)::int,
      true,
      'approved',
      now()
    )
    ON CONFLICT (profile_id) DO UPDATE SET
      bar_number = EXCLUDED.bar_number,
      jurisdiction = EXCLUDED.jurisdiction,
      practice_areas = EXCLUDED.practice_areas,
      years_experience = EXCLUDED.years_experience,
      bio = EXCLUDED.bio,
      hourly_rate_cents = EXCLUDED.hourly_rate_cents,
      is_verified = EXCLUDED.is_verified,
      verification_status = EXCLUDED.verification_status,
      verified_at = EXCLUDED.verified_at
    RETURNING id INTO v_lawyer_profile_id;

    -- Seed Consultation Slots (Mon-Fri 9am-5pm)
    -- Just add a few future slots
    DELETE FROM lawyer.consultation_slots WHERE lawyer_id = v_lawyer_profile_id;
    FOR j IN 1..5 LOOP
      INSERT INTO lawyer.consultation_slots (lawyer_id, start_time, end_time, is_booked)
      VALUES (
        v_lawyer_profile_id,
        now() + (j || ' days')::interval + '09:00:00',
        now() + (j || ' days')::interval + '17:00:00',
        false
      );
    END LOOP;

    -- Seed Tracker Entries for Lawyers (2-3, weight 1.5)
    IF v_visa_ids IS NOT NULL THEN
      DELETE FROM public.tracker_entries WHERE submitted_by = v_user_id;
      FOR j IN 1..(2 + floor(random() * 2)::int) LOOP
        v_random_visa_id := v_visa_ids[1 + floor(random() * array_length(v_visa_ids, 1))::int];
        INSERT INTO public.tracker_entries (
          visa_id, submitted_by, submitter_role, application_date, decision_date, processing_days, outcome, weight
        ) VALUES (
          v_random_visa_id,
          v_user_id,
          'lawyer',
          now() - interval '8 months',
          now() - interval '2 months',
          180,
          'approved',
          1.5
        );
      END LOOP;
    END IF;

  END LOOP;

  ---------------------------------------------------------------------------
  -- 3. SEED ADMINS (10)
  ---------------------------------------------------------------------------
  FOR i IN 1..10 LOOP
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin' || i || '@visabuild.test';

    IF v_user_id IS NULL THEN
      v_user_id := gen_random_uuid();
      INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role
      ) VALUES (
        v_user_id,
        'admin' || i || '@visabuild.test',
        crypt('TestPass123!', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('full_name', v_admin_names[i]),
        'authenticated',
        'authenticated'
      );
    ELSE
      UPDATE auth.users SET
        encrypted_password = crypt('TestPass123!', gen_salt('bf')),
        raw_user_meta_data = jsonb_build_object('full_name', v_admin_names[i]),
        updated_at = now()
      WHERE id = v_user_id;
    END IF;

    v_created_admin_ids := array_append(v_created_admin_ids, v_user_id);

    INSERT INTO public.profiles (
      id, role, full_name, avatar_url, is_active, is_verified
    ) VALUES (
      v_user_id,
      'admin',
      v_admin_names[i],
      'https://ui-avatars.com/api/?name=' || replace(v_admin_names[i], ' ', '+') || '&background=random',
      true,
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role,
      full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url,
      is_active = EXCLUDED.is_active,
      is_verified = EXCLUDED.is_verified;

  END LOOP;

  ---------------------------------------------------------------------------
  -- 4. ADDITIONAL CONTENT (News, Marketplace, etc.)
  ---------------------------------------------------------------------------

  -- News Articles (5)
  -- Clear existing news for cleanliness? Or just add. We'll add.
  FOR i IN 1..5 LOOP
    v_random_lawyer_id := v_created_lawyer_ids[1 + floor(random() * 10)::int];
    INSERT INTO public.news_articles (
      title, slug, body, author_id, is_published, published_at
    ) VALUES (
      'Important Visa Update #' || i,
      'visa-update-' || i || '-' || floor(random() * 1000)::text,
      'This is a significant update regarding visa processing times...',
      v_random_lawyer_id,
      true,
      now()
    );
  END LOOP;

  -- News Comments (10)
  -- Need to get article IDs and User/Lawyer IDs
  SELECT ARRAY_AGG(id) INTO v_article_ids FROM public.news_articles LIMIT 10;

  FOR i IN 1..10 LOOP
     IF v_article_ids IS NOT NULL AND array_length(v_article_ids, 1) > 0 THEN
        v_user_id := v_created_user_ids[1 + floor(random() * 10)::int];
        -- We need a purchase first
        -- Get article details
        DECLARE
           v_article_id uuid := v_article_ids[1 + floor(random() * array_length(v_article_ids, 1))::int];
        BEGIN
           INSERT INTO public.news_comments (
             article_id, author_id, body
           ) VALUES (
             v_article_id, v_user_id, 'Very informative article! Thank you for sharing.'
           );
        END;
     END IF;
  END LOOP;

  -- Marketplace Listings (5)
  -- Need to get lawyer.profiles ids corresponding to v_created_lawyer_ids
  -- We'll just fetch random lawyer profile IDs
  SELECT ARRAY_AGG(id) INTO v_category_ids FROM marketplace_categories;

  FOR i IN 1..5 LOOP
    -- Pick a random lawyer's profile_id (auth id), then get lawyer.profile id
    v_user_id := v_created_lawyer_ids[1 + floor(random() * 10)::int];
    SELECT id INTO v_lawyer_profile_id FROM lawyer.profiles WHERE profile_id = v_user_id;

    INSERT INTO lawyer.marketplace_listings (
      lawyer_id, title, description, category_id, price_cents, listing_type, is_active
    ) VALUES (
      v_lawyer_profile_id,
      'Service Listing #' || i,
      'Professional service description...',
      v_category_ids[1], -- assume at least one category exists
      10000 + i * 1000,
      'service',
      true
    );
  END LOOP;

  -- Marketplace Reviews (3)
  -- Need listing IDs and User IDs
  SELECT ARRAY_AGG(id) INTO v_listing_ids FROM lawyer.marketplace_listings LIMIT 5;

  FOR i IN 1..3 LOOP
     IF v_listing_ids IS NOT NULL AND array_length(v_listing_ids, 1) > 0 THEN
        v_user_id := v_created_user_ids[1 + floor(random() * 10)::int];
        -- We need a purchase first
        -- Get listing details
        DECLARE
           v_listing_id uuid := v_listing_ids[1 + floor(random() * array_length(v_listing_ids, 1))::int];
           v_l_id uuid;
           v_purchase_id uuid;
        BEGIN
           SELECT lawyer_id INTO v_l_id FROM lawyer.marketplace_listings WHERE id = v_listing_id;

           INSERT INTO marketplace_purchases (
             user_id, listing_id, lawyer_id, amount_cents, status
           ) VALUES (
             v_user_id, v_listing_id, v_l_id, 5000, 'completed'
           ) RETURNING id INTO v_purchase_id;

           INSERT INTO marketplace_reviews (
             listing_id, purchase_id, user_id, lawyer_id, rating, title, comment
           ) VALUES (
             v_listing_id, v_purchase_id, v_user_id, v_l_id, 5, 'Great Service', 'Highly recommended!'
           );
        END;
     END IF;
  END LOOP;

END $$;
