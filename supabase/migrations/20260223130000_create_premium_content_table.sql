-- Migration: Create visa_premium_content table for premium visa materials
-- This table stores premium content like example applications, checklists, and document examples

-- Create the table
CREATE TABLE IF NOT EXISTS public.visa_premium_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_id UUID NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('example_application', 'checklist', 'document_examples', 'template', 'guide')),
  file_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.visa_premium_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists (for idempotency)
DROP POLICY IF EXISTS "Allow public read access" ON public.visa_premium_content;

-- Create policy for public read access
CREATE POLICY "Allow public read access" 
  ON public.visa_premium_content 
  FOR SELECT 
  USING (true);

-- Create policy for service role to manage content
DROP POLICY IF EXISTS "Service role can manage premium content" ON public.visa_premium_content;
CREATE POLICY "Service role can manage premium content"
  ON public.visa_premium_content
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_visa_premium_content_visa_id 
  ON public.visa_premium_content(visa_id);

-- Grant permissions
GRANT SELECT ON public.visa_premium_content TO anon, authenticated;
GRANT ALL ON public.visa_premium_content TO service_role;

-- Insert premium content for 820 Partner Visa
-- Note: These URLs point to the uploaded documents in the visa-documents bucket

INSERT INTO public.visa_premium_content (visa_id, title, description, content_type, file_urls, is_published)
SELECT 
  v.id,
  'Complete Partner Visa Application Example',
  'A comprehensive example of a completed Subclass 820 Partner Visa application, including all forms and supporting documentation. Use this as a reference to understand what a complete application looks like.',
  'example_application',
  ARRAY['https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/partner-visa-main.pdf'],
  true
FROM public.visas v
WHERE v.subclass = '820'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, title, description, content_type, file_urls, is_published)
SELECT 
  v.id,
  'Document Checklist Guide',
  'Detailed checklist of all required documents for the Subclass 820 Partner Visa application with explanations and tips for each category.',
  'checklist',
  ARRAY['https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/checklist.md'],
  true
FROM public.visas v
WHERE v.subclass = '820'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, title, description, content_type, file_urls, is_published)
SELECT 
  v.id,
  'Identity Evidence Examples',
  'Sample identity documents including passports, visa grants, and other forms of identification required for the application. These examples show the quality and type of documents expected.',
  'document_examples',
  ARRAY[
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/identity/passport_photo.jpg',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/identity/visa_grant.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/identity/additional_id.pdf'
  ],
  true
FROM public.visas v
WHERE v.subclass = '820'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, title, description, content_type, file_urls, is_published)
SELECT 
  v.id,
  'Financial Evidence Examples',
  'Examples of financial documents demonstrating shared financial commitments, including bank statements, tax returns, home loan documents, and settlement letters. Essential for proving financial interdependence.',
  'document_examples',
  ARRAY[
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/financial/homeloan_transactions.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/financial/commbank_statement.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/financial/westpac_statement.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/financial/settlement_letter.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/financial/tax_noa.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/financial/email_attachment.pdf'
  ],
  true
FROM public.visas v
WHERE v.subclass = '820'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, title, description, content_type, file_urls, is_published)
SELECT 
  v.id,
  'Relationship Evidence Examples',
  'Comprehensive examples of relationship evidence including Form 888 statutory declarations from friends/family, marriage certificates, travel itineraries, and social aspects documentation. Critical for demonstrating genuine relationship.',
  'document_examples',
  ARRAY[
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/social/form888_pradeep_passport.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/social/form888_pradeep_visagrant.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/social/form888_varun_passport.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/marriage/marriage_certificate.pdf',
    'https://zogfvzzizbbmmmnlzxdg.supabase.co/storage/v1/object/public/visa-documents/820/commitment/travel_itinerary.pdf'
  ],
  true
FROM public.visas v
WHERE v.subclass = '820'
ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION extensions.moddatetime()
RETURNS trigger
LANGUAGE plpgsql
AS \$\$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
\$\$;

DROP TRIGGER IF EXISTS visa_premium_content_updated_at ON public.visa_premium_content;
CREATE TRIGGER visa_premium_content_updated_at
  BEFORE UPDATE ON public.visa_premium_content
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime();

-- Verify creation
SELECT 'visa_premium_content table created successfully' as status;
SELECT COUNT(*) as premium_content_entries FROM public.visa_premium_content WHERE visa_id IN (SELECT id FROM public.visas WHERE subclass = '820');
