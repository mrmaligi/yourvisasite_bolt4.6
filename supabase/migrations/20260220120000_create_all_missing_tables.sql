-- 1. consultation_slots
CREATE TABLE IF NOT EXISTS public.consultation_slots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6),
    start_time time,
    end_time time,
    is_available boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consultation_slots_lawyer_id ON public.consultation_slots(lawyer_id);
ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;
-- Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'consultation_slots' AND policyname = 'Public read slots') THEN
        CREATE POLICY "Public read slots" ON public.consultation_slots FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'consultation_slots' AND policyname = 'Lawyers manage own slots') THEN
        CREATE POLICY "Lawyers manage own slots" ON public.consultation_slots FOR ALL USING (auth.uid() = lawyer_id);
    END IF;
END $$;

-- 2. saved_visas
CREATE TABLE IF NOT EXISTS public.saved_visas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    visa_id uuid REFERENCES public.visas(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, visa_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_visas_user_id ON public.saved_visas(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_visas_visa_id ON public.saved_visas(visa_id);
ALTER TABLE public.saved_visas ENABLE ROW LEVEL SECURITY;
-- Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saved_visas' AND policyname = 'Users manage own saved visas') THEN
        CREATE POLICY "Users manage own saved visas" ON public.saved_visas FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- 3. marketplace_listings
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text,
    description text,
    price_cents int,
    category_id uuid REFERENCES public.marketplace_categories(id),
    file_url text,
    is_active boolean DEFAULT true,
    download_count int DEFAULT 0,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_lawyer_id ON public.marketplace_listings(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category_id ON public.marketplace_listings(category_id);
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
-- Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_listings' AND policyname = 'Public read active listings') THEN
        CREATE POLICY "Public read active listings" ON public.marketplace_listings FOR SELECT USING (is_active = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_listings' AND policyname = 'Lawyers manage own listings') THEN
        CREATE POLICY "Lawyers manage own listings" ON public.marketplace_listings FOR ALL USING (auth.uid() = lawyer_id);
    END IF;
END $$;

-- 4. marketplace_reviews
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id uuid REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    rating int CHECK (rating BETWEEN 1 AND 5),
    review_text text,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_listing_id ON public.marketplace_reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_user_id ON public.marketplace_reviews(user_id);
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
-- Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_reviews' AND policyname = 'Public read reviews') THEN
        CREATE POLICY "Public read reviews" ON public.marketplace_reviews FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_reviews' AND policyname = 'Users manage own reviews') THEN
        CREATE POLICY "Users manage own reviews" ON public.marketplace_reviews FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- 5. lawyer_reviews
CREATE TABLE IF NOT EXISTS public.lawyer_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
    rating int CHECK (rating BETWEEN 1 AND 5),
    review_text text,
    reply_text text,
    replied_at timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(booking_id)
);
CREATE INDEX IF NOT EXISTS idx_lawyer_reviews_lawyer_id ON public.lawyer_reviews(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_reviews_user_id ON public.lawyer_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_reviews_booking_id ON public.lawyer_reviews(booking_id);
ALTER TABLE public.lawyer_reviews ENABLE ROW LEVEL SECURITY;
-- Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lawyer_reviews' AND policyname = 'Public read lawyer reviews') THEN
        CREATE POLICY "Public read lawyer reviews" ON public.lawyer_reviews FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lawyer_reviews' AND policyname = 'Users create reviews') THEN
        CREATE POLICY "Users create reviews" ON public.lawyer_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lawyer_reviews' AND policyname = 'Lawyers reply') THEN
        CREATE POLICY "Lawyers reply" ON public.lawyer_reviews FOR UPDATE USING (auth.uid() = lawyer_id);
    END IF;
END $$;

-- 6. messages
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_role text CHECK (sender_role IN ('user', 'lawyer')),
    message_text text,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON public.messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Participants read') THEN
        CREATE POLICY "Participants read" ON public.messages FOR SELECT USING (
            auth.uid() = sender_id OR
            auth.uid() IN (
                SELECT user_id FROM public.bookings WHERE id = booking_id
                UNION
                SELECT lawyer_id FROM public.bookings WHERE id = booking_id
            )
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Participants insert') THEN
        CREATE POLICY "Participants insert" ON public.messages FOR INSERT WITH CHECK (
            auth.uid() = sender_id AND (
                auth.uid() IN (
                    SELECT user_id FROM public.bookings WHERE id = booking_id
                    UNION
                    SELECT lawyer_id FROM public.bookings WHERE id = booking_id
                )
            )
        );
    END IF;
END $$;

-- 7. youtube_feeds
CREATE TABLE IF NOT EXISTS public.youtube_feeds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text,
    youtube_url text,
    thumbnail_url text,
    channel_name text,
    visa_id uuid REFERENCES public.visas(id) ON DELETE SET NULL,
    featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_youtube_feeds_visa_id ON public.youtube_feeds(visa_id);
ALTER TABLE public.youtube_feeds ENABLE ROW LEVEL SECURITY;
-- Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'youtube_feeds' AND policyname = 'Public read youtube feeds') THEN
        CREATE POLICY "Public read youtube feeds" ON public.youtube_feeds FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'youtube_feeds' AND policyname = 'Admins manage youtube feeds') THEN
        CREATE POLICY "Admins manage youtube feeds" ON public.youtube_feeds FOR ALL USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('lawyer-verification', 'lawyer-verification', false) ON CONFLICT (id) DO NOTHING;
-- Storage Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Lawyer verification upload') THEN
        CREATE POLICY "Lawyer verification upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'lawyer-verification');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'User view own verification') THEN
        CREATE POLICY "User view own verification" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'lawyer-verification' AND owner = auth.uid());
    END IF;
END $$;
