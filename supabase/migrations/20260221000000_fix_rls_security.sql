-- Fix insecure RLS policies that used FOR ALL without WITH CHECK

-- 1. consultation_slots
DROP POLICY IF EXISTS "Lawyers manage own slots" ON public.consultation_slots;
CREATE POLICY "Lawyers manage own slots" ON public.consultation_slots
    FOR ALL
    USING (auth.uid() = lawyer_id)
    WITH CHECK (auth.uid() = lawyer_id);

-- 2. saved_visas
DROP POLICY IF EXISTS "Users manage own saved visas" ON public.saved_visas;
CREATE POLICY "Users manage own saved visas" ON public.saved_visas
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. marketplace_listings
DROP POLICY IF EXISTS "Lawyers manage own listings" ON public.marketplace_listings;
CREATE POLICY "Lawyers manage own listings" ON public.marketplace_listings
    FOR ALL
    USING (auth.uid() = lawyer_id)
    WITH CHECK (auth.uid() = lawyer_id);

-- 4. marketplace_reviews
DROP POLICY IF EXISTS "Users manage own reviews" ON public.marketplace_reviews;
CREATE POLICY "Users manage own reviews" ON public.marketplace_reviews
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. youtube_feeds
DROP POLICY IF EXISTS "Admins manage youtube feeds" ON public.youtube_feeds;
CREATE POLICY "Admins manage youtube feeds" ON public.youtube_feeds
    FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
