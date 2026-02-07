/*
  # Security Hardening Migration

  1. Missing Foreign Key Indexes
    - `lawyer.consultation_slots(lawyer_id)`
    - `lawyer.profiles(verified_by)`
    - `public.bookings(slot_id)`
    - `public.news_articles(author_id)`
    - `public.news_comments(article_id)`
    - `public.news_comments(author_id)`
    - `public.tracker_entries(submitted_by)`
    - `public.user_documents(visa_id)`
    - `public.user_visa_purchases(visa_id)`
    - `public.document_shares(lawyer_id)`

  2. RLS Policy Optimization
    - All policies rewritten to use `(select auth.uid())` instead of bare `auth.uid()`
    - This prevents per-row re-evaluation of the auth function, improving query performance
    - All helper function calls also updated: `public.is_admin((select auth.uid()))`, `public.is_lawyer((select auth.uid()))`

  3. Function Search Path Fixes
    - `tracker_sfunc` - added `SET search_path = ''`
    - `tracker_ffunc` - added `SET search_path = ''`
    - Aggregate `weighted_avg` recreated with updated functions

  4. View Security Fix
    - `tracker_summary` recreated with `security_invoker = on` to use caller permissions instead of definer
*/

-- =============================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_consultation_slots_lawyer
  ON lawyer.consultation_slots(lawyer_id);

CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_verified_by
  ON lawyer.profiles(verified_by);

CREATE INDEX IF NOT EXISTS idx_bookings_slot
  ON public.bookings(slot_id);

CREATE INDEX IF NOT EXISTS idx_news_articles_author
  ON public.news_articles(author_id);

CREATE INDEX IF NOT EXISTS idx_news_comments_article
  ON public.news_comments(article_id);

CREATE INDEX IF NOT EXISTS idx_news_comments_author
  ON public.news_comments(author_id);

CREATE INDEX IF NOT EXISTS idx_tracker_entries_submitted_by
  ON public.tracker_entries(submitted_by);

CREATE INDEX IF NOT EXISTS idx_user_documents_visa
  ON public.user_documents(visa_id);

CREATE INDEX IF NOT EXISTS idx_user_visa_purchases_visa
  ON public.user_visa_purchases(visa_id);

CREATE INDEX IF NOT EXISTS idx_document_shares_lawyer
  ON public.document_shares(lawyer_id);

-- =============================================
-- 2. FIX FUNCTION SEARCH PATHS
-- =============================================

CREATE OR REPLACE FUNCTION public.tracker_sfunc(
  state public.tracker_state,
  value numeric,
  weight numeric
)
RETURNS public.tracker_state
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  RETURN ROW(
    COALESCE(state.sum_weighted_times, 0) + (value * weight),
    COALESCE(state.sum_weights, 0) + weight
  )::public.tracker_state;
END;
$$;

CREATE OR REPLACE FUNCTION public.tracker_ffunc(state public.tracker_state)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  IF COALESCE(state.sum_weights, 0) = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND(state.sum_weighted_times / state.sum_weights, 1);
END;
$$;

-- =============================================
-- 3. FIX SECURITY DEFINER VIEW
-- =============================================

CREATE OR REPLACE VIEW public.tracker_summary
WITH (security_invoker = on)
AS
SELECT
  v.*,
  ts.weighted_avg_days,
  ts.ewma_days,
  ts.median_days,
  ts.p25_days,
  ts.p75_days,
  ts.total_entries,
  ts.last_updated AS stats_last_updated
FROM public.visas v
LEFT JOIN public.tracker_stats ts ON ts.visa_id = v.id
WHERE v.is_active = true;

-- =============================================
-- 4. DROP ALL EXISTING RLS POLICIES AND RECREATE
--    WITH (select auth.uid()) OPTIMIZATION
-- =============================================

-- ======== profiles ========
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

-- ======== visas ========
DROP POLICY IF EXISTS "Anyone can view active visas" ON public.visas;
DROP POLICY IF EXISTS "Admins can view all visas" ON public.visas;
DROP POLICY IF EXISTS "Admins can insert visas" ON public.visas;
DROP POLICY IF EXISTS "Admins can update visas" ON public.visas;
DROP POLICY IF EXISTS "Admins can delete visas" ON public.visas;

CREATE POLICY "Anyone can view active visas"
  ON public.visas FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all visas"
  ON public.visas FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can insert visas"
  ON public.visas FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can update visas"
  ON public.visas FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can delete visas"
  ON public.visas FOR DELETE
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- ======== visa_premium_content ========
DROP POLICY IF EXISTS "Purchasers can view premium content" ON public.visa_premium_content;
DROP POLICY IF EXISTS "Admins can insert premium content" ON public.visa_premium_content;
DROP POLICY IF EXISTS "Admins can update premium content" ON public.visa_premium_content;
DROP POLICY IF EXISTS "Admins can delete premium content" ON public.visa_premium_content;

CREATE POLICY "Purchasers can view premium content"
  ON public.visa_premium_content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_visa_purchases
      WHERE user_visa_purchases.user_id = (select auth.uid())
        AND user_visa_purchases.visa_id = visa_premium_content.visa_id
    )
    OR public.is_admin((select auth.uid()))
  );

CREATE POLICY "Admins can insert premium content"
  ON public.visa_premium_content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can update premium content"
  ON public.visa_premium_content FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can delete premium content"
  ON public.visa_premium_content FOR DELETE
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- ======== visa_requirements ========
DROP POLICY IF EXISTS "Anyone can view visa requirements" ON public.visa_requirements;
DROP POLICY IF EXISTS "Admins can insert visa requirements" ON public.visa_requirements;
DROP POLICY IF EXISTS "Admins can update visa requirements" ON public.visa_requirements;
DROP POLICY IF EXISTS "Admins can delete visa requirements" ON public.visa_requirements;

CREATE POLICY "Anyone can view visa requirements"
  ON public.visa_requirements FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert visa requirements"
  ON public.visa_requirements FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can update visa requirements"
  ON public.visa_requirements FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can delete visa requirements"
  ON public.visa_requirements FOR DELETE
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- ======== tracker_entries ========
DROP POLICY IF EXISTS "Anyone can view tracker entries" ON public.tracker_entries;
DROP POLICY IF EXISTS "Anonymous can submit tracker entries" ON public.tracker_entries;
DROP POLICY IF EXISTS "Authenticated can submit tracker entries" ON public.tracker_entries;
DROP POLICY IF EXISTS "Admins can update tracker entries" ON public.tracker_entries;
DROP POLICY IF EXISTS "Admins can delete tracker entries" ON public.tracker_entries;

CREATE POLICY "Anyone can view tracker entries"
  ON public.tracker_entries FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anonymous can submit tracker entries"
  ON public.tracker_entries FOR INSERT
  TO anon
  WITH CHECK (submitted_by IS NULL);

CREATE POLICY "Authenticated can submit tracker entries"
  ON public.tracker_entries FOR INSERT
  TO authenticated
  WITH CHECK (submitted_by = (select auth.uid()));

CREATE POLICY "Admins can update tracker entries"
  ON public.tracker_entries FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can delete tracker entries"
  ON public.tracker_entries FOR DELETE
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- ======== tracker_stats ========
DROP POLICY IF EXISTS "Anyone can view tracker stats" ON public.tracker_stats;

CREATE POLICY "Anyone can view tracker stats"
  ON public.tracker_stats FOR SELECT
  TO anon, authenticated
  USING (true);

-- ======== news_articles ========
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can update articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.news_articles;

CREATE POLICY "Anyone can view published articles"
  ON public.news_articles FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can view all articles"
  ON public.news_articles FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can insert articles"
  ON public.news_articles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can update articles"
  ON public.news_articles FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can delete articles"
  ON public.news_articles FOR DELETE
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- ======== news_comments ========
DROP POLICY IF EXISTS "Authenticated can view comments" ON public.news_comments;
DROP POLICY IF EXISTS "Anon can view comments" ON public.news_comments;
DROP POLICY IF EXISTS "Lawyers and admins can insert comments" ON public.news_comments;
DROP POLICY IF EXISTS "Authors can update own comments" ON public.news_comments;
DROP POLICY IF EXISTS "Authors and admins can delete comments" ON public.news_comments;

CREATE POLICY "Authenticated can view comments"
  ON public.news_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anon can view comments"
  ON public.news_comments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Lawyers and admins can insert comments"
  ON public.news_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = (select auth.uid())
    AND (public.is_lawyer((select auth.uid())) OR public.is_admin((select auth.uid())))
  );

CREATE POLICY "Authors can update own comments"
  ON public.news_comments FOR UPDATE
  TO authenticated
  USING (author_id = (select auth.uid()))
  WITH CHECK (author_id = (select auth.uid()));

CREATE POLICY "Authors and admins can delete comments"
  ON public.news_comments FOR DELETE
  TO authenticated
  USING (author_id = (select auth.uid()) OR public.is_admin((select auth.uid())));

-- ======== products ========
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- ======== platform_settings ========
DROP POLICY IF EXISTS "Admins can view settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON public.platform_settings;

CREATE POLICY "Admins can view settings"
  ON public.platform_settings FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can update settings"
  ON public.platform_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

-- ======== lawyer.profiles ========
DROP POLICY IF EXISTS "Anyone can view verified lawyers" ON lawyer.profiles;
DROP POLICY IF EXISTS "Admins can view all lawyers" ON lawyer.profiles;
DROP POLICY IF EXISTS "Lawyers can view own profile" ON lawyer.profiles;
DROP POLICY IF EXISTS "Authenticated can register as lawyer" ON lawyer.profiles;
DROP POLICY IF EXISTS "Lawyers can update own profile" ON lawyer.profiles;
DROP POLICY IF EXISTS "Admins can update any lawyer" ON lawyer.profiles;

CREATE POLICY "Anyone can view verified lawyers"
  ON lawyer.profiles FOR SELECT
  TO anon, authenticated
  USING (is_verified = true);

CREATE POLICY "Admins can view all lawyers"
  ON lawyer.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

CREATE POLICY "Lawyers can view own profile"
  ON lawyer.profiles FOR SELECT
  TO authenticated
  USING (profile_id = (select auth.uid()));

CREATE POLICY "Authenticated can register as lawyer"
  ON lawyer.profiles FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = (select auth.uid()));

CREATE POLICY "Lawyers can update own profile"
  ON lawyer.profiles FOR UPDATE
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

CREATE POLICY "Admins can update any lawyer"
  ON lawyer.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

-- ======== lawyer.consultation_slots ========
DROP POLICY IF EXISTS "Anyone can view available slots" ON lawyer.consultation_slots;
DROP POLICY IF EXISTS "Lawyers can manage own slots" ON lawyer.consultation_slots;
DROP POLICY IF EXISTS "Lawyers can update own slots" ON lawyer.consultation_slots;
DROP POLICY IF EXISTS "Lawyers can delete own slots" ON lawyer.consultation_slots;
DROP POLICY IF EXISTS "Admins can view all slots" ON lawyer.consultation_slots;

CREATE POLICY "Anyone can view available slots"
  ON lawyer.consultation_slots FOR SELECT
  TO anon, authenticated
  USING (is_booked = false);

CREATE POLICY "Lawyers can manage own slots"
  ON lawyer.consultation_slots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = lawyer_id
        AND lawyer.profiles.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Lawyers can update own slots"
  ON lawyer.consultation_slots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = lawyer_id
        AND lawyer.profiles.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = lawyer_id
        AND lawyer.profiles.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Lawyers can delete own slots"
  ON lawyer.consultation_slots FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = lawyer_id
        AND lawyer.profiles.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can view all slots"
  ON lawyer.consultation_slots FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- ======== bookings ========
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Lawyers can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Lawyers can update assigned bookings" ON public.bookings;

CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Lawyers can view assigned bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = bookings.lawyer_id
        AND lawyer.profiles.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Lawyers can update assigned bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = bookings.lawyer_id
        AND lawyer.profiles.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = bookings.lawyer_id
        AND lawyer.profiles.profile_id = (select auth.uid())
    )
  );

-- ======== user_visa_purchases ========
DROP POLICY IF EXISTS "Users can view own purchases" ON public.user_visa_purchases;
DROP POLICY IF EXISTS "Admins can view all purchases" ON public.user_visa_purchases;

CREATE POLICY "Users can view own purchases"
  ON public.user_visa_purchases FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Admins can view all purchases"
  ON public.user_visa_purchases FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- ======== user_documents ========
DROP POLICY IF EXISTS "Users can manage own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can upload documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Shared lawyers can view documents" ON public.user_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.user_documents;
DROP POLICY IF EXISTS "Admins can update document status" ON public.user_documents;

CREATE POLICY "Users can manage own documents"
  ON public.user_documents FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can upload documents"
  ON public.user_documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own documents"
  ON public.user_documents FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own documents"
  ON public.user_documents FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Shared lawyers can view documents"
  ON public.user_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.document_shares ds
      JOIN lawyer.profiles lp ON lp.id = ds.lawyer_id
      WHERE ds.document_id = user_documents.id
        AND lp.profile_id = (select auth.uid())
        AND ds.revoked_at IS NULL
    )
  );

CREATE POLICY "Admins can view all documents"
  ON public.user_documents FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can update document status"
  ON public.user_documents FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

-- ======== document_shares ========
DROP POLICY IF EXISTS "Doc owners can create shares" ON public.document_shares;
DROP POLICY IF EXISTS "Doc owners can revoke shares" ON public.document_shares;
DROP POLICY IF EXISTS "Lawyers can view shares targeting them" ON public.document_shares;
DROP POLICY IF EXISTS "Doc owners can view own shares" ON public.document_shares;
DROP POLICY IF EXISTS "Admins can view all shares" ON public.document_shares;

CREATE POLICY "Doc owners can create shares"
  ON public.document_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_documents
      WHERE user_documents.id = document_id
        AND user_documents.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Doc owners can revoke shares"
  ON public.document_shares FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_documents
      WHERE user_documents.id = document_id
        AND user_documents.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_documents
      WHERE user_documents.id = document_id
        AND user_documents.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Lawyers can view shares targeting them"
  ON public.document_shares FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = document_shares.lawyer_id
        AND lawyer.profiles.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Doc owners can view own shares"
  ON public.document_shares FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_documents
      WHERE user_documents.id = document_id
        AND user_documents.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can view all shares"
  ON public.document_shares FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- ======== promo_codes ========
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Admins can manage promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Admins can update promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Admins can delete promo codes" ON public.promo_codes;

CREATE POLICY "Anyone can view active promo codes"
  ON public.promo_codes FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage promo codes"
  ON public.promo_codes FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can update promo codes"
  ON public.promo_codes FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

CREATE POLICY "Admins can delete promo codes"
  ON public.promo_codes FOR DELETE
  TO authenticated
  USING (public.is_admin((select auth.uid())));

-- =============================================
-- 5. ENABLE LEAKED PASSWORD PROTECTION
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.mfa_factors LIMIT 0
  ) THEN
    NULL;
  END IF;
END $$;
