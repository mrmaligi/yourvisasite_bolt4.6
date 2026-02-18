-- Migration: Create visa_links table for official DHA references
-- Track: 007
-- Status: IN_PROGRESS

-- Create visa_links table for multiple official links per visa
CREATE TABLE IF NOT EXISTS public.visa_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
    link_type VARCHAR(50) NOT NULL, -- 'official', 'processing_times', 'fees', 'forms', 'checklist'
    url TEXT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(visa_id, link_type)
);

-- Enable RLS
ALTER TABLE public.visa_links ENABLE ROW LEVEL SECURITY;

-- RLS: Public read
CREATE POLICY "Allow public read access" ON public.visa_links
    FOR SELECT USING (true);

-- RLS: Admin write
CREATE POLICY "Allow admin write access" ON public.visa_links
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create index
CREATE INDEX idx_visa_links_visa ON public.visa_links(visa_id);
CREATE INDEX idx_visa_links_type ON public.visa_links(link_type);

-- Insert DHA links for all visas
INSERT INTO public.visa_links (visa_id, link_type, url, title, is_primary)
SELECT 
    id,
    'official',
    official_link,
    'Official DHA Page',
    true
FROM public.visas
WHERE official_link IS NOT NULL;

-- Add processing times links
INSERT INTO public.visa_links (visa_id, link_type, url, title, is_primary)
SELECT 
    id,
    'processing_times',
    'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times',
    'Global Processing Times',
    false
FROM public.visas;

-- Verify
SELECT COUNT(*) as total_links FROM public.visa_links;
