/*
  # Lawyer Marketplace System

  1. New Tables
    - `marketplace_categories` (public schema)
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name
      - `description` (text) - Category description
      - `icon` (text) - Icon name for UI
      - `created_at` (timestamptz)
    
    - `marketplace_listings` (lawyer schema)
      - `id` (uuid, primary key)
      - `lawyer_id` (uuid, foreign key to lawyer.profiles)
      - `title` (text) - Listing title
      - `description` (text) - Detailed description
      - `short_description` (text) - Brief summary
      - `category_id` (uuid, foreign key to marketplace_categories)
      - `price_cents` (integer) - Price in cents
      - `listing_type` (text) - 'service' or 'product'
      - `duration_minutes` (integer) - For services
      - `delivery_days` (integer) - For products
      - `is_active` (boolean) - Whether listing is published
      - `image_url` (text) - Product/service image
      - `features` (jsonb) - Array of feature bullets
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `marketplace_purchases` (public schema)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `listing_id` (uuid, foreign key to marketplace_listings)
      - `lawyer_id` (uuid, foreign key to lawyer.profiles)
      - `amount_cents` (integer)
      - `status` (text) - 'pending', 'completed', 'cancelled', 'refunded'
      - `stripe_payment_id` (text)
      - `purchased_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `notes` (text) - User notes or delivery instructions
  
  2. Security
    - Enable RLS on all tables
    - Marketplace categories: Public read, admin write
    - Marketplace listings: Public read active listings, lawyers manage their own
    - Marketplace purchases: Users view their own, lawyers view sales
  
  3. Indexes
    - Index on lawyer_id for listings
    - Index on user_id for purchases
    - Index on listing_id for purchases
    - Index on category_id for listings
*/

-- Create marketplace categories table
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text DEFAULT 'package',
  created_at timestamptz DEFAULT now()
);

-- Create marketplace listings table in lawyer schema
CREATE TABLE IF NOT EXISTS lawyer.marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  short_description text,
  category_id uuid REFERENCES marketplace_categories(id) ON DELETE SET NULL,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  listing_type text NOT NULL CHECK (listing_type IN ('service', 'product')),
  duration_minutes integer CHECK (duration_minutes > 0),
  delivery_days integer CHECK (delivery_days > 0),
  is_active boolean DEFAULT true,
  image_url text,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create marketplace purchases table
CREATE TABLE IF NOT EXISTS marketplace_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES lawyer.marketplace_listings(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  stripe_payment_id text,
  purchased_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  notes text
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_lawyer ON lawyer.marketplace_listings(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON lawyer.marketplace_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_active ON lawyer.marketplace_listings(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_user ON marketplace_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_listing ON marketplace_purchases(listing_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_lawyer ON marketplace_purchases(lawyer_id);

-- Enable RLS
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;

-- Policies for marketplace_categories
CREATE POLICY "Anyone can view categories"
  ON marketplace_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON marketplace_categories FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin')
  WITH CHECK ((auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin');

-- Policies for marketplace_listings
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
      AND profiles.profile_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can create listings"
  ON lawyer.marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = lawyer_id
      AND profiles.profile_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can update their listings"
  ON lawyer.marketplace_listings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = marketplace_listings.lawyer_id
      AND profiles.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = lawyer_id
      AND profiles.profile_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can delete their listings"
  ON lawyer.marketplace_listings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = marketplace_listings.lawyer_id
      AND profiles.profile_id = auth.uid()
    )
  );

-- Policies for marketplace_purchases
CREATE POLICY "Users can view their purchases"
  ON marketplace_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Lawyers can view their sales"
  ON marketplace_purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE profiles.id = marketplace_purchases.lawyer_id
      AND profiles.profile_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create purchases"
  ON marketplace_purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their purchase notes"
  ON marketplace_purchases FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default categories
INSERT INTO marketplace_categories (name, description, icon) VALUES
  ('Visa Consultation', 'One-on-one consultation services for visa applications', 'video'),
  ('Document Review', 'Professional review of visa application documents', 'file-check'),
  ('Application Preparation', 'Complete visa application preparation services', 'clipboard-check'),
  ('Legal Representation', 'Legal representation for visa proceedings', 'scale'),
  ('Immigration Strategy', 'Strategic planning for immigration goals', 'target'),
  ('Document Templates', 'Ready-to-use document templates and guides', 'file-text')
ON CONFLICT (name) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_marketplace_listing_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_marketplace_listing_timestamp'
  ) THEN
    CREATE TRIGGER update_marketplace_listing_timestamp
      BEFORE UPDATE ON lawyer.marketplace_listings
      FOR EACH ROW
      EXECUTE FUNCTION update_marketplace_listing_timestamp();
  END IF;
END $$;
