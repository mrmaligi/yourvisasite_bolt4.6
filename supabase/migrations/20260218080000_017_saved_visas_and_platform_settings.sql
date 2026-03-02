-- Migration 017: Saved visas (bookmarks) + Platform settings table
-- VisaBuild Cycle 3 — 18 Feb 2026

-- ============================================================
-- 1. Saved Visas (user bookmarks)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.saved_visas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, visa_id)
);

CREATE INDEX idx_saved_visas_user ON public.saved_visas(user_id);
CREATE INDEX idx_saved_visas_visa ON public.saved_visas(visa_id);

ALTER TABLE public.saved_visas ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own saved visas
CREATE POLICY "Users can read own saved visas"
  ON public.saved_visas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save visas"
  ON public.saved_visas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave visas"
  ON public.saved_visas FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. Platform Settings (key-value config store for admin)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}',
  description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (some are public, e.g. site name)
CREATE POLICY "Anyone can read platform settings"
  ON public.platform_settings FOR SELECT
  USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can update platform settings"
  ON public.platform_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert platform settings"
  ON public.platform_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Seed default settings
INSERT INTO public.platform_settings (key, value, description) VALUES
  ('site_name', '"VisaBuild"', 'Platform display name'),
  ('site_tagline', '"Your trusted visa application companion"', 'Site tagline / description'),
  ('default_currency', '"AUD"', 'Default currency for prices'),
  ('premium_price_cents', '4900', 'Default premium guide price in cents'),
  ('consultation_commission_pct', '15', 'Platform commission on consultation bookings (%)'),
  ('tracker_min_entries', '5', 'Minimum tracker entries before showing stats'),
  ('features', '{"tracker_enabled": true, "marketplace_enabled": true, "consultations_enabled": true, "news_enabled": true, "premium_enabled": true}', 'Feature toggles'),
  ('support_email', '"support@visabuild.com.au"', 'Support email address'),
  ('countries_enabled', '["Australia", "Canada", "United Kingdom"]', 'Enabled countries for visa search')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 3. Additional Australian visa data: Partner (820/801) + Parent (143)
-- ============================================================

-- Partner Visa (subclass 820/801) — combined temporary + permanent
INSERT INTO public.visas (
  subclass_number, name, country, category, description, official_link,
  processing_time_months_min, processing_time_months_max,
  government_fee_aud, is_active, requirements
) VALUES (
  '820/801',
  'Partner Visa (Temporary & Permanent)',
  'Australia',
  'family',
  'For de facto partners and spouses of Australian citizens, permanent residents, or eligible New Zealand citizens. The subclass 820 (temporary) is granted first, followed by the subclass 801 (permanent) after a waiting period (usually 2 years from application date).',
  'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore/temporary-820',
  20, 35,
  8850,
  true,
  '{
    "eligibility": [
      "Be in a genuine and continuing relationship with your sponsor (married or de facto for at least 12 months)",
      "Be sponsored by an eligible Australian citizen, permanent resident, or eligible NZ citizen",
      "Meet health and character requirements",
      "Be in Australia when you apply (onshore) or outside Australia (offshore 309/100)"
    ],
    "documents": {
      "Identity": [
        "Valid passport (certified copy of bio page)",
        "Birth certificate",
        "National identity card (if applicable)",
        "Change of name certificate (if applicable)"
      ],
      "Relationship Evidence": [
        "Marriage certificate OR evidence of 12+ months de facto relationship",
        "Joint financial commitments (bank accounts, loans, leases)",
        "Nature of household (shared living arrangements, domestic responsibilities)",
        "Social recognition (statutory declarations from friends/family, photos together)",
        "Commitment to each other (future plans, wills, power of attorney)"
      ],
      "Sponsor Documents": [
        "Proof of Australian citizenship or permanent residency",
        "Sponsor statutory declaration (Form 40SP)",
        "Police clearance for sponsor"
      ],
      "Health & Character": [
        "Health examination results (organised through ImmiAccount)",
        "Police clearance certificates from every country lived in 12+ months since age 16",
        "Australian Federal Police (AFP) check"
      ],
      "Supporting": [
        "Form 47SP — Application for migration to Australia by a partner",
        "Form 40SP — Sponsorship for a partner to migrate to Australia",
        "Two statutory declarations from Australian citizens/PR supporting the relationship (Form 888)",
        "Evidence of any dependent children included in application"
      ]
    },
    "processing_source": "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore/temporary-820",
    "processing_note": "Processing times vary significantly. As of 2025, 75% of applications processed within 20-35 months for the temporary (820) stage."
  }'::jsonb
) ON CONFLICT (subclass_number) DO NOTHING;

-- Parent Visa (subclass 143) — Contributory Parent
INSERT INTO public.visas (
  subclass_number, name, country, category, description, official_link,
  processing_time_months_min, processing_time_months_max,
  government_fee_aud, is_active, requirements
) VALUES (
  '143',
  'Contributory Parent Visa',
  'Australia',
  'family',
  'For parents of settled Australian citizens, permanent residents, or eligible NZ citizens. This is the contributory (faster processing) pathway. A non-contributory parent visa (103) is also available but has significantly longer processing times (30+ years queue).',
  'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-143',
  29, 50,
  4990,
  true,
  '{
    "eligibility": [
      "Have a child who is a settled Australian citizen, permanent resident, or eligible NZ citizen",
      "Pass the balance of family test (at least half of your children live in Australia, OR more children live in Australia than any other single country)",
      "Be sponsored by an eligible sponsor (usually the child in Australia)",
      "Meet health and character requirements",
      "Have an Assurance of Support (AoS) in place"
    ],
    "documents": {
      "Identity": [
        "Valid passport (certified copy of bio page)",
        "Birth certificate",
        "National identity card (if applicable)"
      ],
      "Family Relationship": [
        "Birth certificates of ALL your children (to prove balance of family test)",
        "Evidence of where each child lives (addresses, residency documents)",
        "Marriage/divorce certificates if applicable",
        "Adoption papers if applicable"
      ],
      "Sponsor Documents": [
        "Form 40 — Sponsorship for a parent to migrate to Australia",
        "Proof sponsor is a settled Australian citizen or PR (lived in Australia for 2+ years)",
        "Sponsor financial evidence"
      ],
      "Financial": [
        "Assurance of Support (AoS) from Services Australia — requires a bond (currently ~$10,000-$14,000)",
        "Contributory payment: second instalment of AUD $43,600 per applicant (payable when visa is ready to be granted)",
        "Evidence of financial capacity"
      ],
      "Health & Character": [
        "Health examination results (organised through ImmiAccount)",
        "Police clearance certificates from every country lived in 12+ months since age 16",
        "Australian Federal Police (AFP) check if lived in Australia"
      ]
    },
    "processing_source": "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-143",
    "processing_note": "Processing times for Contributory Parent visa (143) are typically 29-50 months. The non-contributory Parent visa (103) has a 29+ year queue.",
    "cost_note": "Total cost is significant: base application charge ($4,990) plus second instalment ($43,600 per applicant). This is the trade-off for faster processing compared to subclass 103."
  }'::jsonb
) ON CONFLICT (subclass_number) DO NOTHING;

-- ============================================================
-- 4. Premium content (step-by-step guides) for new visas
-- ============================================================

-- Partner Visa premium guide
INSERT INTO public.visa_premium_content (visa_id, title, content, sort_order)
SELECT v.id, 'Step 1: Check Your Eligibility', 
  'Before starting your Partner Visa (820/801) application, confirm your eligibility:

**Relationship Requirements:**
- You must be in a genuine and continuing relationship — either married OR in a de facto relationship for at least 12 months
- Same-sex relationships are recognised under Australian immigration law
- Your relationship must be exclusive (you cannot sponsor or be sponsored by multiple partners)

**Sponsor Requirements:**
- Your partner must be an Australian citizen, permanent resident, or eligible New Zealand citizen
- A person can only sponsor two partners in their lifetime
- There must be a 5-year gap between sponsorships (unless exceptional circumstances)

**De Facto Evidence Tip:**
If you have not been in a de facto relationship for 12 months, you may still apply if:
- You registered your relationship in an Australian state/territory, OR
- You have a child together, OR
- Compelling and compassionate circumstances exist

📋 **Action:** Complete the [Partner Visa Eligibility Tool](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore/temporary-820) on the Department of Home Affairs website.

Source: [Department of Home Affairs — Partner visa (subclass 820/801)](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore/temporary-820)',
  1
FROM public.visas v WHERE v.subclass_number = '820/801'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, title, content, sort_order)
SELECT v.id, 'Step 2: Gather Relationship Evidence',
  'The strength of your application depends heavily on relationship evidence. Organise documents across four key categories:

**1. Financial Aspects**
- Joint bank account statements (last 12 months)
- Joint mortgage, lease, or rental agreement
- Shared utility bills, insurance policies
- Joint credit card or loan accounts

**2. Nature of Household**
- Statutory declarations describing your living arrangements
- Evidence of shared address (mail, registration documents)
- Photos showing shared domestic life
- Evidence of shared domestic responsibilities

**3. Social Aspects**
- Statutory declarations from 2 people (citizens/PRs) who know your relationship (Form 888)
- Joint invitations, social media posts showing you as a couple
- Photos from events, holidays, family gatherings (include dates)
- Correspondence addressed to both of you

**4. Commitment**
- Evidence of plans for a shared future (property plans, travel bookings)
- Wills or superannuation beneficiary nominations naming each other
- Power of attorney documents
- Evidence of knowledge of each other''s personal circumstances

⚠️ **Important:** Provide evidence spanning the ENTIRE relationship period, not just recent months. The Department wants to see consistency over time.

Source: [Form 888 — Statutory declaration](https://immi.homeaffairs.gov.au/form-listing/forms/888.pdf)',
  2
FROM public.visas v WHERE v.subclass_number = '820/801'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, title, content, sort_order)
SELECT v.id, 'Step 3: Lodge Your Application',
  'Once you have gathered your evidence:

**1. Create an ImmiAccount**
- Register at [ImmiAccount](https://online.immi.gov.au/lusc/login)
- Complete Form 47SP (Application for migration by a partner)
- Your sponsor completes Form 40SP (Sponsorship for a partner)

**2. Pay the Application Fee**
- Current base fee: AUD $8,850 (as of 2025)
- Second instalment: AUD $1,475 (if English language threshold not met)
- Payment by credit card attracts a surcharge

**3. Upload Documents**
- Upload all relationship evidence through ImmiAccount
- Attach certified copies of identity documents
- Ensure photos are clear and labelled with dates

**4. Health Examinations**
- Arrange health exams through ImmiAccount (generates referral letter)
- Use a panel physician — [find one here](https://immi.homeaffairs.gov.au/help-support/contact-us/offices-and-agents/find-a-panel-physician)
- Results are sent directly to the Department

**5. Police Clearances**
- Australian Federal Police (AFP) check: [apply online](https://www.afp.gov.au/our-work/national-police-checks)
- Clearances from every country you lived in 12+ months since age 16

📌 **Processing Timeline:** After lodging, you may receive a bridging visa (BVA) allowing you to stay in Australia while the 820 is processed (typically 20-35 months).

Source: [ImmiAccount](https://online.immi.gov.au/lusc/login) | [Application fees](https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing)',
  3
FROM public.visas v WHERE v.subclass_number = '820/801'
ON CONFLICT DO NOTHING;

-- Contributory Parent Visa premium guide
INSERT INTO public.visa_premium_content (visa_id, title, content, sort_order)
SELECT v.id, 'Step 1: Understand Your Options — 143 vs 103',
  'Australia offers two main onshore parent visa pathways:

| Feature | Subclass 143 (Contributory) | Subclass 103 (Non-Contributory) |
|---------|---------------------------|-------------------------------|
| Processing | ~29-50 months | ~29+ years queue |
| Base fee | ~$4,990 | ~$4,990 |
| Second instalment | ~$43,600 per applicant | None |
| Total cost (approx) | ~$48,590+ | ~$4,990 |

**Why choose 143?** If you can afford the higher cost, processing is measured in years rather than decades. The 103 queue is currently estimated at over 29 years.

**Offshore alternative:** Subclass 173 (temporary) → 143 (permanent) allows you to pay in two stages:
1. Lodge 173 with lower initial cost
2. Convert to 143 within 2 years and pay the second instalment then

📋 **Action:** Decide which pathway suits your family''s financial situation and timeline.

Source: [Contributory Parent visa (143)](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-143) | [Parent visa (103)](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/parent-103)',
  1
FROM public.visas v WHERE v.subclass_number = '143'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, title, content, sort_order)
SELECT v.id, 'Step 2: Pass the Balance of Family Test',
  'The Balance of Family Test is a critical eligibility requirement:

**The Test:** At least half of your children must be Australian citizens/PRs, OR more of your children live in Australia than in any single other country.

**How to calculate:**
- Count ALL your children (biological, adopted, step-children)
- Determine where each child is "settled" (lived for at least 2 years)
- Include deceased children only if they were settled in Australia at time of death

**Example:**
- You have 4 children: 2 in Australia, 1 in India, 1 in UK
- Result: PASS (2 out of 4 = 50% in Australia)

**Example (fail):**
- You have 3 children: 1 in Australia, 2 in India
- Result: FAIL (only 1 out of 3 in Australia, and more children in India)

**Documents needed:**
- Birth certificates for ALL your children
- Evidence of where each child lives (utility bills, residency permits, citizenship certificates)
- Statutory declarations from children confirming their residence

⚠️ **Common mistake:** Forgetting to include step-children or adopted children in the count. ALL children must be counted.

Source: [Balance of Family Test](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-143)',
  2
FROM public.visas v WHERE v.subclass_number = '143'
ON CONFLICT DO NOTHING;

INSERT INTO public.visa_premium_content (visa_id, title, content, sort_order)
SELECT v.id, 'Step 3: Arrange Assurance of Support & Lodge',
  'The Assurance of Support (AoS) is a financial guarantee that you won''t need to rely on government income support:

**Assurance of Support:**
- Your sponsor (usually your child in Australia) must apply to Services Australia
- A bond of approximately $10,000-$14,000 is required
- The bond is held for 10 years and returned if you don''t claim social security during that period
- Apply through [Services Australia](https://www.servicesaustralia.gov.au/assurance-support)

**Application Process:**
1. Create an ImmiAccount and complete the online application
2. Complete Form 47PA (Application for a parent to migrate to Australia)
3. Your sponsor completes Form 40 (Sponsorship for a parent)
4. Pay the first instalment (~$4,990)
5. Upload all supporting documents

**Second Instalment:**
- AUD $43,600 per applicant (as of 2025)
- Payable only when the Department is ready to grant the visa
- You will be notified and given time to pay

**Health & Character:**
- Standard health examinations via panel physician
- Police clearances from all countries of residence (12+ months since age 16)

📌 **Timeline tip:** Start the AoS process early — it can take several months for Services Australia to process.

Source: [Services Australia — AoS](https://www.servicesaustralia.gov.au/assurance-support) | [Parent visa fees](https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing)',
  3
FROM public.visas v WHERE v.subclass_number = '143'
ON CONFLICT DO NOTHING;

-- Seed tracker entries for new visas
INSERT INTO public.tracker_entries (visa_id, processing_days, status, occupation, submitted_at)
SELECT v.id, days, 'approved', occupation, now() - (random() * interval '180 days')
FROM public.visas v,
LATERAL (VALUES
  (540, 'N/A'), (600, 'N/A'), (480, 'N/A'),
  (720, 'N/A'), (650, 'N/A'), (510, 'N/A'),
  (580, 'N/A'), (690, 'N/A')
) AS t(days, occupation)
WHERE v.subclass_number = '820/801'
ON CONFLICT DO NOTHING;

INSERT INTO public.tracker_entries (visa_id, processing_days, status, occupation, submitted_at)
SELECT v.id, days, 'approved', occupation, now() - (random() * interval '240 days')
FROM public.visas v,
LATERAL (VALUES
  (870, 'N/A'), (960, 'N/A'), (1020, 'N/A'),
  (1100, 'N/A'), (780, 'N/A'), (1200, 'N/A'),
  (900, 'N/A')
) AS t(days, occupation)
WHERE v.subclass_number = '143'
ON CONFLICT DO NOTHING;
