-- Seed Emergency Data
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    admin_id uuid := '33333333-3333-3333-3333-333333333333';
    lawyer_id uuid := '22222222-2222-2222-2222-222222222222';
    lawyer_profile_id uuid := '44444444-4444-4444-4444-444444444444';
    cat_id uuid := '55555555-5555-5555-5555-555555555555';
BEGIN
    -- Insert Admin Profile (ensure referenced profile exists)
    INSERT INTO public.profiles (id, role, full_name, is_active, is_verified)
    VALUES (admin_id, 'admin', 'Admin User', true, true)
    ON CONFLICT (id) DO NOTHING;

    -- Insert Lawyer Profile (User)
    INSERT INTO public.profiles (id, role, full_name, is_active, is_verified)
    VALUES (lawyer_id, 'lawyer', 'Sarah Lawyer', true, true)
    ON CONFLICT (id) DO NOTHING;

    -- Insert Lawyer Profile (Details) - Try public.lawyer_profiles
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lawyer_profiles') THEN
        INSERT INTO public.lawyer_profiles (id, user_id, verification_status, bio, languages)
        VALUES (lawyer_profile_id, lawyer_id, 'approved', 'Expert immigration lawyer.', ARRAY['English'])
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Insert Lawyer Profile (Details) - Try lawyer.profiles
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'lawyer' AND table_name = 'profiles') THEN
        INSERT INTO lawyer.profiles (id, user_id, verification_status, bio, languages)
        VALUES (lawyer_profile_id, lawyer_id, 'approved', 'Expert immigration lawyer.', ARRAY['English'])
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Seed News Articles
    INSERT INTO public.news_articles (title, slug, body, excerpt, category, author_id, is_published, published_at)
    VALUES
    ('New Visa Rules 2026', 'new-visa-rules-2026', 'Complete details about the new visa rules coming into effect...', 'Major changes to skilled migration visas announced.', 'policy', admin_id, true, NOW()),
    ('Processing Times Update', 'processing-times-update-feb', 'Processing times have improved for 189 and 190 visas...', 'Faster processing for skilled visas observed.', 'processing', admin_id, true, NOW())
    ON CONFLICT (slug) DO NOTHING;

    -- Seed Marketplace Categories
    INSERT INTO public.marketplace_categories (id, name, icon)
    VALUES (cat_id, 'Consultation', 'video')
    ON CONFLICT (name) DO NOTHING;

    -- Seed Marketplace Listings (Lawyer Schema)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'lawyer' AND table_name = 'marketplace_listings') THEN
        -- Check if listings exist to avoid duplicates
        IF NOT EXISTS (SELECT 1 FROM lawyer.marketplace_listings WHERE lawyer_id = lawyer_profile_id) THEN
            INSERT INTO lawyer.marketplace_listings (lawyer_id, title, description, category_id, price_cents, listing_type, duration_minutes, is_active)
            VALUES
            (lawyer_profile_id, 'Initial Consultation', '30 minute video consultation to discuss your visa options.', cat_id, 15000, 'service', 30, true),
            (lawyer_profile_id, 'Document Review', 'Detailed review of your prepared application documents.', cat_id, 30000, 'service', 60, true);
        END IF;
    END IF;

END $$;
