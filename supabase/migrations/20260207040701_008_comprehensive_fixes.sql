/*
  # Comprehensive Fixes & Seed Data

  1. Security Fixes
    - Add missing indexes for performance
    
  2. Seed Data
    - Premium content for sample visas
    - Products for all visas
    - Document categories

  3. Helper Functions
    - Current user role helper
*/

-- ======== Create Products for All Visas ========
INSERT INTO public.products (visa_id, price_cents, is_active)
SELECT
  id,
  4900,
  true
FROM public.visas
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE products.visa_id = visas.id
)
ON CONFLICT DO NOTHING;

-- ======== Seed Premium Content for Popular Visas ========
-- Business Innovation and Investment (Permanent) Visa - Subclass 888
INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT
  v.id,
  1,
  'Check Eligibility Requirements',
  E'Before applying, ensure you meet the following criteria:\n\n• Have held a provisional Business Innovation visa (subclass 188) for at least 3 years\n• Meet specific business or investment thresholds\n• Satisfy health and character requirements\n• Have no outstanding debts to the Australian Government',
  'Identity Documents',
  'Passport showing all visa grants and travel history'
FROM public.visas v
WHERE v.subclass_number = '888'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT
  v.id,
  2,
  'Gather Financial Evidence',
  E'Collect comprehensive business and financial records:\n\n• Business Activity Statements (BAS) for the last 2 years\n• Financial statements audited by qualified accountant\n• Tax returns for business and personal income\n• Evidence of business turnover and ownership\n• Bank statements showing financial capacity',
  'Financial Documents',
  'Audited financial statements, tax returns, BAS statements'
FROM public.visas v
WHERE v.subclass_number = '888'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT
  v.id,
  3,
  'Submit Application via ImmiAccount',
  E'Complete your application online:\n\n1. Create or log into your ImmiAccount\n2. Complete Form 1188 - Nomination for Business Innovation\n3. Upload all required documents (see checklist)\n4. Pay application fee (AUD $2,590 base fee)\n5. Submit application and note TRN number',
  NULL,
  NULL
FROM public.visas v
WHERE v.subclass_number = '888'
ON CONFLICT DO NOTHING;

-- Contributory Parent Visa - Subclass 143
INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT
  v.id,
  1,
  'Secure Sponsorship from Your Child',
  E'Your Australian citizen or permanent resident child must sponsor you:\n\n• Child must be 18+ years old\n• Child must be settled in Australia (usually 2+ years)\n• Complete Form 40 - Sponsorship for migration to Australia\n• Provide evidence of Australian citizenship or PR status\n• Child must meet Assurance of Support requirements',
  'Sponsorship Documents',
  'Form 40, sponsor citizenship/PR certificate, settlement evidence'
FROM public.visas v
WHERE v.subclass_number = '143'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT
  v.id,
  2,
  'Pass the Balance of Family Test',
  E'You must have at least half of your children living in Australia:\n\n• Count all your children (biological, adopted, step-children)\n• At least 50% must be Australian citizens or PR holders\n• OR you have more children in Australia than any other country\n• Prepare family tree diagram showing all children',
  'Family Documents',
  'Birth certificates for all children, evidence of children status in Australia'
FROM public.visas v
WHERE v.subclass_number = '143'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT
  v.id,
  3,
  'Arrange Assurance of Support',
  E'Financial guarantee required from your sponsor:\n\n• Assurer must be 18+ Australian citizen/PR\n• Must pass Centrelink income test\n• Bond amount: approximately $10,000-$14,000\n• Book Assurance of Support interview with Centrelink\n• Obtain AoS approval before visa decision',
  'Financial Documents',
  'Assurance of Support bank bond, Centrelink approval letter'
FROM public.visas v
WHERE v.subclass_number = '143'
ON CONFLICT DO NOTHING;

-- Global Talent Visa - Subclass 858
INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT
  v.id,
  1,
  'Identify Your Target Sector',
  E'The Global Talent program focuses on 10 priority sectors:\n\n• AgTech\n• Space and Advanced Manufacturing\n• FinTech\n• Energy and Mining Technology\n• MedTech\n• Cyber Security\n• Quantum Information\n• Advanced Digital, Data Science and ICT\n• Resources Technology\n• Infrastructure and Tourism\n\nEnsure your expertise aligns with one of these sectors.',
  NULL,
  NULL
FROM public.visas v
WHERE v.subclass_number = '858'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT
  v.id,
  2,
  'Obtain a Nominator',
  E'You need an Australian organization or individual to nominate you:\n\n• Nominator must be a recognized expert in your field\n• Can be an Australian citizen, PR, or eligible New Zealand citizen\n• Can be an Australian organization\n• Nominator completes recommendation letter\n• Provide evidence of nominator standing in the field',
  'Nomination Documents',
  'Nominator CV, recommendation letter, evidence of expertise'
FROM public.visas v
WHERE v.subclass_number = '858'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, step_number, title, body, document_category, document_explanation)
SELECT
  v.id,
  3,
  'Demonstrate Exceptional Talent',
  E'Compile evidence of your international recognition:\n\n• Academic qualifications (PhD, Masters)\n• Publications in high-impact journals\n• Patents and intellectual property\n• Awards and prizes\n• Letters of recommendation from international experts\n• Evidence of salary above Fair Work high income threshold (currently $162,000)\n• Media coverage of your work',
  'Professional Documents',
  'Degrees, publications, patents, recommendation letters, salary evidence'
FROM public.visas v
WHERE v.subclass_number = '858'
ON CONFLICT DO NOTHING;

-- ======== Create Document Categories Reference ========
CREATE TABLE IF NOT EXISTS public.document_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.document_categories (name, description, icon, sort_order) VALUES
  ('Identity Documents', 'Passport, birth certificate, national ID', 'user', 1),
  ('Financial Documents', 'Bank statements, tax returns, proof of funds', 'dollar-sign', 2),
  ('Professional Documents', 'Degrees, certificates, employment letters', 'briefcase', 3),
  ('Family Documents', 'Marriage certificate, birth certificates, family tree', 'users', 4),
  ('Property Documents', 'Lease agreements, property ownership', 'home', 5),
  ('Medical Documents', 'Health examination, vaccination records', 'heart', 6),
  ('Police Clearance', 'Character certificates, police checks', 'shield', 7),
  ('Sponsorship Documents', 'Sponsor forms, relationship evidence', 'user-check', 8),
  ('Nomination Documents', 'Employer nomination, skills assessment', 'award', 9),
  ('Other', 'Additional supporting documents', 'file-text', 10)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view document categories"
  ON public.document_categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- ======== Create Helper Function for Role Check ========
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.profiles WHERE id = auth.uid()),
    'user'
  );
$$;

-- ======== Add missing indexes ========
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id
  ON public.stripe_customers(user_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_stripe_orders_checkout_session
  ON public.stripe_orders(checkout_session_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_verification
  ON lawyer.profiles(verification_status, is_verified) WHERE verification_status = 'pending';

CREATE INDEX IF NOT EXISTS idx_consultation_slots_available
  ON lawyer.consultation_slots(lawyer_id, start_time) WHERE NOT is_booked;

CREATE INDEX IF NOT EXISTS idx_user_visa_purchases_lookup
  ON public.user_visa_purchases(user_id, visa_id);

CREATE INDEX IF NOT EXISTS idx_user_documents_category
  ON public.user_documents(user_id, visa_id, document_category);

CREATE INDEX IF NOT EXISTS idx_document_shares_active
  ON public.document_shares(lawyer_id) WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tracker_entries_visa_recent
  ON public.tracker_entries(visa_id, decision_date DESC);

CREATE INDEX IF NOT EXISTS idx_news_articles_published
  ON public.news_articles(is_published, published_at DESC) WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_visas_active_category
  ON public.visas(category, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_visas_subclass_lookup
  ON public.visas(subclass_number) WHERE is_active = true;
