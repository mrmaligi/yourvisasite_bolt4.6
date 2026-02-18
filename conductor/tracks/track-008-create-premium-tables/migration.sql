-- Migration: Create visa_premium_content table
-- Track: 008
-- Status: IN_PROGRESS

-- Create visa_premium_content table for step-by-step guides
CREATE TABLE IF NOT EXISTS public.visa_premium_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
    section_number INTEGER NOT NULL, -- 1-8
    section_title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL, -- Markdown/HTML content
    tips TEXT, -- Lawyer tips
    common_mistakes TEXT, -- What to avoid
    examples JSONB, -- Example answers/templates
    estimated_minutes INTEGER, -- Time to complete section
    required_documents TEXT[], -- Array of document category keys
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(visa_id, section_number)
);

-- Enable RLS
ALTER TABLE public.visa_premium_content ENABLE ROW LEVEL SECURITY;

-- RLS: Only users who purchased can read
CREATE POLICY "Allow access if purchased" ON public.visa_premium_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_visa_purchases
            WHERE user_id = auth.uid() AND visa_id = visa_premium_content.visa_id
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS: Admin can write
CREATE POLICY "Allow admin write" ON public.visa_premium_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX idx_premium_content_visa ON public.visa_premium_content(visa_id);
CREATE INDEX idx_premium_content_section ON public.visa_premium_content(section_number);

-- Create user_visa_purchases table if not exists
CREATE TABLE IF NOT EXISTS public.user_visa_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    amount_cents INTEGER NOT NULL DEFAULT 4900,
    currency VARCHAR(3) DEFAULT 'AUD',
    status VARCHAR(20) DEFAULT 'active', -- active, refunded, expired
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL = never
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, visa_id)
);

-- Enable RLS on purchases
ALTER TABLE public.user_visa_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own purchases" ON public.user_visa_purchases
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own purchases" ON public.user_visa_purchases
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_purchases_user ON public.user_visa_purchases(user_id);
CREATE INDEX idx_purchases_visa ON public.user_visa_purchases(visa_id);

-- Verify
SELECT 
    'premium_content table' as check_item, 
    COUNT(*) as count 
FROM information_schema.tables 
WHERE table_name = 'visa_premium_content'
UNION ALL
SELECT 
    'user_purchases table',
    COUNT(*)
FROM information_schema.tables 
WHERE table_name = 'user_visa_purchases';
