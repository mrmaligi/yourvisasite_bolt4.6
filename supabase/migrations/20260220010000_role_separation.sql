-- Role-based authentication setup
-- Ensures clear separation between user, lawyer, and admin

-- Add role validation to profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'lawyer', 'admin'));

-- Create role-specific views for cleaner access

-- User view (only user data)
CREATE OR REPLACE VIEW user_profiles AS
SELECT * FROM profiles WHERE role = 'user';

-- Lawyer view (only approved lawyers)
CREATE OR REPLACE VIEW lawyer_profiles_public AS
SELECT p.*, lp.bar_number, lp.jurisdiction, lp.specializations, lp.years_experience, 
       lp.hourly_rate_cents, lp.consultation_fee_cents, lp.is_available
FROM profiles p
JOIN lawyer_profiles lp ON p.id = lp.user_id
WHERE p.role = 'lawyer' AND lp.verification_status = 'approved';

-- Admin view (all users)
CREATE OR REPLACE VIEW admin_all_profiles AS
SELECT * FROM profiles;

-- Function to check user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = user_uuid;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to redirect based on role
CREATE OR REPLACE FUNCTION get_dashboard_url(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = user_uuid;
  
  CASE user_role
    WHEN 'admin' THEN RETURN '/admin';
    WHEN 'lawyer' THEN RETURN '/lawyer/dashboard';
    ELSE RETURN '/dashboard';
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS: Users can only see their own data
CREATE POLICY "Users access own data only" ON profiles
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS: Lawyers can see public info but edit only own
CREATE POLICY "Lawyers view public profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM lawyer_profiles WHERE verification_status = 'approved')
    OR auth.uid() = id
  );

-- RLS: Admins can do everything
CREATE POLICY "Admins full access" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create separate onboarding flags
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'welcome';

-- Track last login for each role type
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Function to update login stats
CREATE OR REPLACE FUNCTION update_login_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET last_login_at = NOW(), 
      login_count = login_count + 1,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth sign in
DROP TRIGGER IF EXISTS trigger_update_login ON auth.sessions;
CREATE TRIGGER trigger_update_login
  AFTER INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_login_stats();
