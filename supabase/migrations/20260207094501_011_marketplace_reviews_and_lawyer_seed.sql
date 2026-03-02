/*
  # Marketplace Reviews and Lawyer Seed Data

  1. New Tables
    - `marketplace_reviews` (public schema)
      - `id` (uuid, primary key)
      - `listing_id` (uuid, foreign key to marketplace_listings)
      - `purchase_id` (uuid, foreign key to marketplace_purchases)
      - `user_id` (uuid, foreign key to profiles)
      - `lawyer_id` (uuid, foreign key to lawyer.profiles)
      - `rating` (integer, 1-5)
      - `title` (text) - Review title
      - `comment` (text) - Review body
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on marketplace_reviews
    - Anyone can view reviews
    - Only users who purchased can create reviews
    - Users can update their own reviews
    - Admins can manage all reviews

  3. Seed Data
    - Create lawyer account for mrmaligi2007@gmail.com
    - Add sample listings for the lawyer
    - Add sample reviews to demonstrate the system

  4. Indexes
    - Index on listing_id for reviews
    - Index on lawyer_id for reviews
    - Index on rating for filtering
*/

-- Create marketplace reviews table
CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES lawyer.marketplace_listings(id) ON DELETE CASCADE,
  purchase_id uuid REFERENCES marketplace_purchases(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_listing ON marketplace_reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_lawyer ON marketplace_reviews(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_rating ON marketplace_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_user ON marketplace_reviews(user_id);

-- Enable RLS
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for marketplace_reviews
CREATE POLICY "Anyone can view reviews"
  ON marketplace_reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create reviews for their purchases"
  ON marketplace_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id AND
    EXISTS (
      SELECT 1 FROM marketplace_purchases
      WHERE marketplace_purchases.id = purchase_id
      AND marketplace_purchases.user_id = (select auth.uid())
      AND marketplace_purchases.status = 'completed'
    )
  );

CREATE POLICY "Users can update their own reviews"
  ON marketplace_reviews FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON marketplace_reviews FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can manage all reviews"
  ON marketplace_reviews FOR ALL
  TO authenticated
  USING (((select auth.jwt())->>'app_metadata')::jsonb->>'role' = 'admin')
  WITH CHECK (((select auth.jwt())->>'app_metadata')::jsonb->>'role' = 'admin');

-- Function to update review timestamp
CREATE OR REPLACE FUNCTION update_marketplace_review_timestamp()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_marketplace_review_timestamp
  BEFORE UPDATE ON marketplace_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_review_timestamp();

-- Seed lawyer account and listings
DO $$
DECLARE
  v_user_id uuid;
  v_lawyer_id uuid;
  v_category_visa_consultation uuid;
  v_category_doc_review uuid;
  v_category_app_prep uuid;
  v_listing1_id uuid;
  v_listing2_id uuid;
  v_listing3_id uuid;
  v_reviewer1_id uuid;
  v_reviewer2_id uuid;
  v_purchase1_id uuid;
  v_purchase2_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'mrmaligi2007@gmail.com'
  LIMIT 1;

  -- Create user if doesn't exist
  IF v_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'mrmaligi2007@gmail.com',
      crypt('DemoPassword123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"lawyer"}'::jsonb,
      '{"full_name":"Maria Maligi"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO v_user_id;

    -- Create profile
    INSERT INTO profiles (id, role, full_name, avatar_url, phone, is_active)
    VALUES (
      v_user_id,
      'lawyer',
      'Maria Maligi',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      '+1-555-0123',
      true
    );
  ELSE
    -- Update existing user to be a lawyer
    UPDATE auth.users
    SET raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"lawyer"}'::jsonb
    WHERE id = v_user_id;

    UPDATE profiles
    SET role = 'lawyer',
        full_name = COALESCE(full_name, 'Maria Maligi'),
        avatar_url = COALESCE(avatar_url, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'),
        phone = COALESCE(phone, '+1-555-0123')
    WHERE id = v_user_id;
  END IF;

  -- Create or update lawyer profile
  SELECT id INTO v_lawyer_id
  FROM lawyer.profiles
  WHERE profile_id = v_user_id
  LIMIT 1;

  IF v_lawyer_id IS NULL THEN
    INSERT INTO lawyer.profiles (
      profile_id,
      bar_number,
      jurisdiction,
      practice_areas,
      years_experience,
      bio,
      hourly_rate_cents,
      is_verified,
      verification_status,
      verified_at
    ) VALUES (
      v_user_id,
      'CA-BAR-123456',
      'California, USA',
      ARRAY['Immigration Law', 'Visa Applications', 'Work Permits', 'Family Sponsorship'],
      12,
      'Experienced immigration attorney specializing in work visas, family sponsorship, and complex immigration cases. Over 12 years of successful practice helping clients navigate the immigration process with personalized service and expert guidance.',
      25000,
      true,
      'approved',
      now()
    )
    RETURNING id INTO v_lawyer_id;
  ELSE
    UPDATE lawyer.profiles
    SET bar_number = 'CA-BAR-123456',
        jurisdiction = 'California, USA',
        practice_areas = ARRAY['Immigration Law', 'Visa Applications', 'Work Permits', 'Family Sponsorship'],
        years_experience = 12,
        bio = 'Experienced immigration attorney specializing in work visas, family sponsorship, and complex immigration cases. Over 12 years of successful practice helping clients navigate the immigration process with personalized service and expert guidance.',
        hourly_rate_cents = 25000,
        is_verified = true,
        verification_status = 'approved',
        verified_at = COALESCE(verified_at, now())
    WHERE id = v_lawyer_id;
  END IF;

  -- Get category IDs
  SELECT id INTO v_category_visa_consultation FROM marketplace_categories WHERE name = 'Visa Consultation' LIMIT 1;
  SELECT id INTO v_category_doc_review FROM marketplace_categories WHERE name = 'Document Review' LIMIT 1;
  SELECT id INTO v_category_app_prep FROM marketplace_categories WHERE name = 'Application Preparation' LIMIT 1;

  -- Delete existing listings for this lawyer to avoid duplicates
  DELETE FROM lawyer.marketplace_listings WHERE lawyer_id = v_lawyer_id;

  -- Create marketplace listings
  INSERT INTO lawyer.marketplace_listings (
    id,
    lawyer_id,
    title,
    description,
    short_description,
    category_id,
    price_cents,
    listing_type,
    duration_minutes,
    is_active,
    image_url,
    features
  ) VALUES 
  (
    gen_random_uuid(),
    v_lawyer_id,
    'Comprehensive Visa Consultation',
    'Get expert guidance on your visa application with a one-on-one consultation. I will review your situation, explain your options, and provide a clear roadmap for your immigration journey. Perfect for those starting their visa application process or facing complex situations.',
    'One-on-one expert consultation for your visa application needs',
    v_category_visa_consultation,
    15000,
    'service',
    60,
    true,
    'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600',
    '["60-minute video consultation", "Personalized visa strategy", "Document checklist provided", "Email follow-up included", "Same-day booking available"]'::jsonb
  ),
  (
    gen_random_uuid(),
    v_lawyer_id,
    'Professional Document Review',
    'Have your visa application documents professionally reviewed before submission. I will check for completeness, accuracy, and compliance with current requirements. Includes detailed feedback and revision suggestions to maximize your approval chances.',
    'Professional review of your complete visa application documents',
    v_category_doc_review,
    8500,
    'service',
    NULL,
    true,
    'https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg?auto=compress&cs=tinysrgb&w=600',
    '["Complete document review", "Detailed feedback report", "Compliance check", "48-hour turnaround", "One round of revisions included"]'::jsonb
  ),
  (
    gen_random_uuid(),
    v_lawyer_id,
    'Full Application Preparation Service',
    'Let me handle your entire visa application from start to finish. This comprehensive service includes document preparation, form completion, supporting letter drafting, and submission assistance. Ideal for busy professionals who want expert handling of their entire application.',
    'Complete end-to-end visa application preparation and filing',
    v_category_app_prep,
    45000,
    'service',
    NULL,
    true,
    'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=600',
    '["Complete application preparation", "All forms and documents", "Supporting letters drafted", "Submission assistance", "Ongoing case monitoring", "Priority support"]'::jsonb
  );

  -- Get the listing IDs
  SELECT id INTO v_listing1_id FROM lawyer.marketplace_listings WHERE lawyer_id = v_lawyer_id AND title = 'Comprehensive Visa Consultation' LIMIT 1;
  SELECT id INTO v_listing2_id FROM lawyer.marketplace_listings WHERE lawyer_id = v_lawyer_id AND title = 'Professional Document Review' LIMIT 1;
  SELECT id INTO v_listing3_id FROM lawyer.marketplace_listings WHERE lawyer_id = v_lawyer_id AND title = 'Full Application Preparation Service' LIMIT 1;

  -- Create sample reviewer users if they don't exist
  SELECT id INTO v_reviewer1_id FROM auth.users WHERE email = 'reviewer1@example.com' LIMIT 1;
  
  IF v_reviewer1_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
      'authenticated', 'authenticated', 'reviewer1@example.com',
      crypt('password', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Sarah Johnson"}'::jsonb,
      now(), now(), '', '', '', ''
    )
    RETURNING id INTO v_reviewer1_id;

    INSERT INTO profiles (id, role, full_name)
    VALUES (v_reviewer1_id, 'user', 'Sarah Johnson')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  SELECT id INTO v_reviewer2_id FROM auth.users WHERE email = 'reviewer2@example.com' LIMIT 1;
  
  IF v_reviewer2_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
      'authenticated', 'authenticated', 'reviewer2@example.com',
      crypt('password', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Michael Chen"}'::jsonb,
      now(), now(), '', '', '', ''
    )
    RETURNING id INTO v_reviewer2_id;

    INSERT INTO profiles (id, role, full_name)
    VALUES (v_reviewer2_id, 'user', 'Michael Chen')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Delete existing purchases to avoid duplicates
  DELETE FROM marketplace_purchases WHERE listing_id IN (v_listing1_id, v_listing2_id, v_listing3_id);

  -- Create sample purchases (mark as completed)
  INSERT INTO marketplace_purchases (
    id,
    user_id, listing_id, lawyer_id, amount_cents, status,
    stripe_payment_id, purchased_at, completed_at
  ) VALUES
  (
    gen_random_uuid(),
    v_reviewer1_id, v_listing1_id, v_lawyer_id, 15000, 'completed',
    'mock_payment_1', now() - interval '30 days', now() - interval '29 days'
  ),
  (
    gen_random_uuid(),
    v_reviewer2_id, v_listing2_id, v_lawyer_id, 8500, 'completed',
    'mock_payment_2', now() - interval '45 days', now() - interval '44 days'
  );

  -- Get purchase IDs
  SELECT id INTO v_purchase1_id FROM marketplace_purchases WHERE user_id = v_reviewer1_id AND listing_id = v_listing1_id LIMIT 1;
  SELECT id INTO v_purchase2_id FROM marketplace_purchases WHERE user_id = v_reviewer2_id AND listing_id = v_listing2_id LIMIT 1;

  -- Delete existing reviews to avoid duplicates
  DELETE FROM marketplace_reviews WHERE lawyer_id = v_lawyer_id;

  -- Create sample reviews
  INSERT INTO marketplace_reviews (
    listing_id, purchase_id, user_id, lawyer_id, rating, title, comment, created_at
  ) VALUES
  (
    v_listing1_id,
    v_purchase1_id,
    v_reviewer1_id,
    v_lawyer_id,
    5,
    'Excellent consultation - highly recommend!',
    'Maria was incredibly knowledgeable and patient. She took the time to understand my situation and provided clear, actionable advice. The consultation exceeded my expectations and I felt confident about my visa application after speaking with her. Worth every penny!',
    now() - interval '28 days'
  ),
  (
    v_listing2_id,
    v_purchase2_id,
    v_reviewer2_id,
    v_lawyer_id,
    5,
    'Thorough and professional document review',
    'The document review service was fantastic. Maria caught several issues I had missed and provided detailed feedback on how to improve my application. Her attention to detail is impressive and the turnaround was faster than promised. Highly professional service.',
    now() - interval '43 days'
  ),
  (
    v_listing1_id,
    NULL,
    v_reviewer2_id,
    v_lawyer_id,
    4,
    'Very helpful and informative',
    'Great consultation service. Maria was professional and provided valuable insights into the visa process. The only reason I am not giving 5 stars is that I wished we had more time to discuss some edge cases, but overall very satisfied with the service.',
    now() - interval '15 days'
  );

END $$;
