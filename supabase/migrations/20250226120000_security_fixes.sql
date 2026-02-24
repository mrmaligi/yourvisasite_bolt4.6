-- Fix Security Issues and RLS Policies

-- 1. Helper Function for Admin Check to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (is_admin());

-- 3. Bookings RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = lawyer_id OR is_admin());

CREATE POLICY "Users can insert their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = lawyer_id OR is_admin());

CREATE POLICY "Users can delete their own bookings"
  ON bookings FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- 4. Tracker Entries RLS
ALTER TABLE tracker_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tracker entries"
  ON tracker_entries FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own tracker entries"
  ON tracker_entries FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own tracker entries"
  ON tracker_entries FOR UPDATE
  USING (auth.uid() = submitted_by OR is_admin());

CREATE POLICY "Users can delete their own tracker entries"
  ON tracker_entries FOR DELETE
  USING (auth.uid() = submitted_by OR is_admin());

-- 5. User Visa Purchases RLS
ALTER TABLE user_visa_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON user_visa_purchases FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can insert purchases"
  ON user_visa_purchases FOR INSERT
  WITH CHECK (is_admin()); -- Or service role

-- 6. User Documents RLS
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents"
  ON user_documents FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can insert their own documents"
  ON user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON user_documents FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can delete their own documents"
  ON user_documents FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- 7. Visa Premium Content RLS (Restrict to purchasers)
ALTER TABLE visa_premium_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view premium content if purchased"
  ON visa_premium_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_visa_purchases
      WHERE user_id = auth.uid() AND visa_id = visa_premium_content.visa_id
    )
    OR is_admin()
  );

-- 8. Handle New User Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Fix Lawyer Profiles Column
-- Ensure user_id exists and is populated
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lawyer_profiles' AND column_name = 'user_id') THEN
        ALTER TABLE lawyer_profiles ADD COLUMN user_id UUID REFERENCES profiles(id);
    END IF;
END $$;

-- Populate user_id from profile_id if it exists and user_id is null
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lawyer_profiles' AND column_name = 'profile_id') THEN
        UPDATE lawyer_profiles
        SET user_id = CAST(profile_id AS UUID)
        WHERE user_id IS NULL AND profile_id IS NOT NULL;
    END IF;
END $$;
