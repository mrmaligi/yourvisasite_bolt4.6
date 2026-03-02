/*
  # Marketplace Security and Performance Fixes

  1. RLS Performance Optimization
    - Replace `auth.uid()` with `(select auth.uid())` in all marketplace policies
    - Replace `auth.jwt()` with `(select auth.jwt())` for performance
    - This prevents re-evaluation of auth functions for each row

  2. Function Security
    - Set secure search_path for marketplace timestamp function
    - Prevents search_path manipulation attacks

  3. Notes
    - Multiple permissive policies are intentional (admin OR user access patterns)
    - Unused indexes will be evaluated after data accumulation
*/

-- Drop existing policies for marketplace_categories
DROP POLICY IF EXISTS "Anyone can view categories" ON marketplace_categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON marketplace_categories;

-- Recreate with optimized auth functions
CREATE POLICY "Anyone can view categories"
  ON marketplace_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON marketplace_categories FOR ALL
  TO authenticated
  USING (((select auth.jwt())->>'app_metadata')::jsonb->>'role' = 'admin')
  WITH CHECK (((select auth.jwt())->>'app_metadata')::jsonb->>'role' = 'admin');

-- Drop existing policies for marketplace_purchases
DROP POLICY IF EXISTS "Users can view their purchases" ON marketplace_purchases;
DROP POLICY IF EXISTS "Lawyers can view their sales" ON marketplace_purchases;
DROP POLICY IF EXISTS "Authenticated users can create purchases" ON marketplace_purchases;
DROP POLICY IF EXISTS "Users can update their purchase notes" ON marketplace_purchases;

-- Recreate with optimized auth functions
CREATE POLICY "Users can view their purchases"
  ON marketplace_purchases FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Lawyers can view their sales"
  ON marketplace_purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = marketplace_purchases.lawyer_id
      AND profiles.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Authenticated users can create purchases"
  ON marketplace_purchases FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their purchase notes"
  ON marketplace_purchases FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Drop existing policies for lawyer.marketplace_listings
DROP POLICY IF EXISTS "Anyone can view active listings" ON lawyer.marketplace_listings;
DROP POLICY IF EXISTS "Lawyers can view their own listings" ON lawyer.marketplace_listings;
DROP POLICY IF EXISTS "Lawyers can create listings" ON lawyer.marketplace_listings;
DROP POLICY IF EXISTS "Lawyers can update their listings" ON lawyer.marketplace_listings;
DROP POLICY IF EXISTS "Lawyers can delete their listings" ON lawyer.marketplace_listings;

-- Recreate with optimized auth functions
CREATE POLICY "Anyone can view active listings"
  ON lawyer.marketplace_listings FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Lawyers can view their own listings"
  ON lawyer.marketplace_listings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = marketplace_listings.lawyer_id
      AND profiles.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Lawyers can create listings"
  ON lawyer.marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = lawyer_id
      AND profiles.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Lawyers can update their listings"
  ON lawyer.marketplace_listings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = marketplace_listings.lawyer_id
      AND profiles.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = lawyer_id
      AND profiles.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Lawyers can delete their listings"
  ON lawyer.marketplace_listings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = marketplace_listings.lawyer_id
      AND profiles.profile_id = (select auth.uid())
    )
  );

-- Fix function search_path security
-- Drop trigger first, then function
DROP TRIGGER IF EXISTS update_marketplace_listing_timestamp ON lawyer.marketplace_listings;
DROP FUNCTION IF EXISTS update_marketplace_listing_timestamp();

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION update_marketplace_listing_timestamp()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER update_marketplace_listing_timestamp
  BEFORE UPDATE ON lawyer.marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_listing_timestamp();
