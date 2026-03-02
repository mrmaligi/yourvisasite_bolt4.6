-- Create lawyer.visa_prices table
CREATE TABLE IF NOT EXISTS lawyer.visa_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  hourly_rate_cents integer,
  consultation_fee_cents integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(lawyer_id, visa_id)
);

-- Add questions to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS questions text;

-- Enable RLS on lawyer.visa_prices
ALTER TABLE lawyer.visa_prices ENABLE ROW LEVEL SECURITY;

-- Allow public read access to visa prices
CREATE POLICY "Public profiles are viewable by everyone"
  ON lawyer.visa_prices
  FOR SELECT
  USING (true);

-- Allow lawyers to insert/update their own prices
CREATE POLICY "Lawyers can insert their own visa prices"
  ON lawyer.visa_prices
  FOR INSERT
  WITH CHECK (
    lawyer_id IN (
      SELECT id FROM lawyer.profiles
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can update their own visa prices"
  ON lawyer.visa_prices
  FOR UPDATE
  USING (
    lawyer_id IN (
      SELECT id FROM lawyer.profiles
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can delete their own visa prices"
  ON lawyer.visa_prices
  FOR DELETE
  USING (
    lawyer_id IN (
      SELECT id FROM lawyer.profiles
      WHERE profile_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER lawyer_visa_prices_updated_at
  BEFORE UPDATE ON lawyer.visa_prices
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);
