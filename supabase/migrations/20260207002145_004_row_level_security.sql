/*
  # Row-Level Security Policies

  1. Helper Functions
    - `is_admin(uid)` - checks raw_app_meta_data for admin role
    - `is_lawyer(uid)` - checks raw_app_meta_data for lawyer role

  2. Security (RLS enabled on ALL tables)
    - `profiles` - public read, self-update, admin update
    - `visas` - public read (active only), admin CRUD
    - `visa_premium_content` - purchasers + admins read, admin CRUD
    - `visa_requirements` - public read, admin CRUD
    - `tracker_entries` - public read, anyone can insert, admin manage
    - `tracker_stats` - public read
    - `news_articles` - public read (published), admin CRUD
    - `news_comments` - authenticated read, lawyer/admin insert, author edit/delete
    - `products` - public read (active), admin CRUD
    - `platform_settings` - admin only
    - `lawyer.profiles` - public read (verified), self update, admin update
    - `lawyer.consultation_slots` - public read (available), owner CRUD, admin read
    - `bookings` - user reads own, lawyer reads own, admin reads all
    - `user_visa_purchases` - user reads own, admin reads all
    - `user_documents` - owner CRUD, shared lawyers read, admin read
    - `document_shares` - owner insert/revoke, lawyer read own, admin read
    - `promo_codes` - public read (active), admin CRUD
*/

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data ->> 'role' = 'admin'
     FROM auth.users
     WHERE id = uid),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.is_lawyer(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data ->> 'role' = 'lawyer'
     FROM auth.users
     WHERE id = uid),
    false
  );
$$;

-- ======== profiles ========
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ======== visas ========
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active visas"
  ON public.visas FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all visas"
  ON public.visas FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert visas"
  ON public.visas FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update visas"
  ON public.visas FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete visas"
  ON public.visas FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ======== visa_premium_content ========
ALTER TABLE public.visa_premium_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Purchasers can view premium content"
  ON public.visa_premium_content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_visa_purchases
      WHERE user_visa_purchases.user_id = auth.uid()
        AND user_visa_purchases.visa_id = visa_premium_content.visa_id
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can insert premium content"
  ON public.visa_premium_content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update premium content"
  ON public.visa_premium_content FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete premium content"
  ON public.visa_premium_content FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ======== visa_requirements ========
ALTER TABLE public.visa_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visa requirements"
  ON public.visa_requirements FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert visa requirements"
  ON public.visa_requirements FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update visa requirements"
  ON public.visa_requirements FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete visa requirements"
  ON public.visa_requirements FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ======== tracker_entries ========
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;

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
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Admins can update tracker entries"
  ON public.tracker_entries FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete tracker entries"
  ON public.tracker_entries FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ======== tracker_stats ========
ALTER TABLE public.tracker_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tracker stats"
  ON public.tracker_stats FOR SELECT
  TO anon, authenticated
  USING (true);

-- ======== news_articles ========
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON public.news_articles FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can view all articles"
  ON public.news_articles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert articles"
  ON public.news_articles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update articles"
  ON public.news_articles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete articles"
  ON public.news_articles FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ======== news_comments ========
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;

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
    author_id = auth.uid()
    AND (public.is_lawyer(auth.uid()) OR public.is_admin(auth.uid()))
  );

CREATE POLICY "Authors can update own comments"
  ON public.news_comments FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and admins can delete comments"
  ON public.news_comments FOR DELETE
  TO authenticated
  USING (author_id = auth.uid() OR public.is_admin(auth.uid()));

-- ======== products ========
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ======== platform_settings ========
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view settings"
  ON public.platform_settings FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update settings"
  ON public.platform_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ======== lawyer.profiles ========
ALTER TABLE lawyer.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified lawyers"
  ON lawyer.profiles FOR SELECT
  TO anon, authenticated
  USING (is_verified = true);

CREATE POLICY "Admins can view all lawyers"
  ON lawyer.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Lawyers can view own profile"
  ON lawyer.profiles FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Authenticated can register as lawyer"
  ON lawyer.profiles FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Lawyers can update own profile"
  ON lawyer.profiles FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Admins can update any lawyer"
  ON lawyer.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ======== lawyer.consultation_slots ========
ALTER TABLE lawyer.consultation_slots ENABLE ROW LEVEL SECURITY;

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
        AND lawyer.profiles.profile_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can update own slots"
  ON lawyer.consultation_slots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = lawyer_id
        AND lawyer.profiles.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = lawyer_id
        AND lawyer.profiles.profile_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can delete own slots"
  ON lawyer.consultation_slots FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = lawyer_id
        AND lawyer.profiles.profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all slots"
  ON lawyer.consultation_slots FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ======== bookings ========
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Lawyers can view assigned bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = bookings.lawyer_id
        AND lawyer.profiles.profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Lawyers can update assigned bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = bookings.lawyer_id
        AND lawyer.profiles.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = bookings.lawyer_id
        AND lawyer.profiles.profile_id = auth.uid()
    )
  );

-- ======== user_visa_purchases ========
ALTER TABLE public.user_visa_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON public.user_visa_purchases FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all purchases"
  ON public.user_visa_purchases FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ======== user_documents ========
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents"
  ON public.user_documents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can upload documents"
  ON public.user_documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own documents"
  ON public.user_documents FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own documents"
  ON public.user_documents FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Shared lawyers can view documents"
  ON public.user_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.document_shares ds
      JOIN lawyer.profiles lp ON lp.id = ds.lawyer_id
      WHERE ds.document_id = user_documents.id
        AND lp.profile_id = auth.uid()
        AND ds.revoked_at IS NULL
    )
  );

CREATE POLICY "Admins can view all documents"
  ON public.user_documents FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update document status"
  ON public.user_documents FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ======== document_shares ========
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doc owners can create shares"
  ON public.document_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_documents
      WHERE user_documents.id = document_id
        AND user_documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Doc owners can revoke shares"
  ON public.document_shares FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_documents
      WHERE user_documents.id = document_id
        AND user_documents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_documents
      WHERE user_documents.id = document_id
        AND user_documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can view shares targeting them"
  ON public.document_shares FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer.profiles
      WHERE lawyer.profiles.id = document_shares.lawyer_id
        AND lawyer.profiles.profile_id = auth.uid()
    )
  );

CREATE POLICY "Doc owners can view own shares"
  ON public.document_shares FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_documents
      WHERE user_documents.id = document_id
        AND user_documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all shares"
  ON public.document_shares FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ======== promo_codes ========
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active promo codes"
  ON public.promo_codes FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage promo codes"
  ON public.promo_codes FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update promo codes"
  ON public.promo_codes FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete promo codes"
  ON public.promo_codes FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));
