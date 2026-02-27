-- Fix schema gaps for visas, products, and lawyer pricing

-- 1. Ensure visas table has subclass_number and it is synced with subclass
ALTER TABLE public.visas
ADD COLUMN IF NOT EXISTS subclass_number text;

UPDATE public.visas
SET subclass_number = subclass
WHERE subclass_number IS NULL;

-- 2. Create stripe_customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'stripe_customers' AND policyname = 'Users view own customer id'
    ) THEN
        CREATE POLICY "Users view own customer id"
        ON public.stripe_customers FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- 3. Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_id UUID REFERENCES public.visas(id) ON DELETE SET NULL,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  price_cents INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public view products'
    ) THEN
        CREATE POLICY "Public view products"
        ON public.products FOR SELECT
        USING (is_active = true);
    END IF;
END $$;

-- 4. Ensure bookings table has questions column
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS questions text;

-- 5. Create lawyer.visa_prices table if it doesn't exist
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

ALTER TABLE lawyer.visa_prices ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'visa_prices' AND schemaname = 'lawyer' AND policyname = 'Public profiles are viewable by everyone'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone"
          ON lawyer.visa_prices
          FOR SELECT
          USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'visa_prices' AND schemaname = 'lawyer' AND policyname = 'Lawyers can insert their own visa prices'
    ) THEN
        CREATE POLICY "Lawyers can insert their own visa prices"
          ON lawyer.visa_prices
          FOR INSERT
          WITH CHECK (
            lawyer_id IN (
              SELECT id FROM lawyer.profiles
              WHERE profile_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'visa_prices' AND schemaname = 'lawyer' AND policyname = 'Lawyers can update their own visa prices'
    ) THEN
        CREATE POLICY "Lawyers can update their own visa prices"
          ON lawyer.visa_prices
          FOR UPDATE
          USING (
            lawyer_id IN (
              SELECT id FROM lawyer.profiles
              WHERE profile_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'visa_prices' AND schemaname = 'lawyer' AND policyname = 'Lawyers can delete their own visa prices'
    ) THEN
        CREATE POLICY "Lawyers can delete their own visa prices"
          ON lawyer.visa_prices
          FOR DELETE
          USING (
            lawyer_id IN (
              SELECT id FROM lawyer.profiles
              WHERE profile_id = auth.uid()
            )
          );
    END IF;
END $$;

-- Create trigger for updated_at on lawyer.visa_prices if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'lawyer_visa_prices_updated_at') THEN
        CREATE TRIGGER lawyer_visa_prices_updated_at
          BEFORE UPDATE ON lawyer.visa_prices
          FOR EACH ROW
          EXECUTE FUNCTION extensions.moddatetime(updated_at);
    END IF;
END $$;
