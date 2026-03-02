-- ============================================
-- CREATE ADMIN PROFILE
-- UUID: a1c1c904-6e7a-49ab-9a2d-02308632b1eb
-- ============================================

INSERT INTO public.profiles (
    id,
    role,
    full_name,
    avatar_url,
    phone,
    bar_number,
    jurisdiction,
    practice_areas,
    years_experience,
    hourly_rate_cents,
    is_verified,
    verification_status,
    created_at,
    updated_at,
    is_active
) VALUES (
    'a1c1c904-6e7a-49ab-9a2d-02308632b1eb',
    'admin',
    'Manikaran',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    true,
    'approved',
    NOW(),
    NOW(),
    true
);

SELECT 'Admin profile created successfully!' as status;
