DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Create extension if not exists
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  -- Check if user exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@visabuild.local';

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    -- Insert into auth.users
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role
    ) VALUES (
      v_user_id,
      'admin@visabuild.local',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "QA Admin"}',
      'authenticated',
      'authenticated'
    );
  ELSE
    -- Update existing user password if they exist
    UPDATE auth.users SET
      encrypted_password = crypt('admin123', gen_salt('bf')),
      raw_user_meta_data = '{"full_name": "QA Admin"}',
      updated_at = now()
    WHERE id = v_user_id;
  END IF;

  -- Upsert into public.profiles
  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    avatar_url,
    is_active,
    is_verified
  ) VALUES (
    v_user_id,
    'admin',
    'QA Admin',
    'https://ui-avatars.com/api/?name=QA+Admin&background=random',
    true,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    is_active = EXCLUDED.is_active,
    is_verified = EXCLUDED.is_verified;

END $$;
