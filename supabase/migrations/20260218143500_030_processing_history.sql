-- Migration: Create processing_time_history table
-- Track: 017
-- Status: IN_PROGRESS

-- Create processing_time_history table for tracking trends
CREATE TABLE IF NOT EXISTS public.processing_time_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
    reported_date DATE NOT NULL,
    stream_name VARCHAR(100), -- e.g., 'points-tested', 'nominated', 'family'
    min_months INTEGER,
    max_months INTEGER,
    median_months INTEGER,
    source VARCHAR(255), -- 'DHA official', 'user reported', 'lawyer reported'
    is_official BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.processing_time_history ENABLE ROW LEVEL SECURITY;

-- RLS: Public read
CREATE POLICY "Allow public read access" ON public.processing_time_history
    FOR SELECT USING (true);

-- RLS: Admin write
CREATE POLICY "Allow admin write access" ON public.processing_time_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX idx_proc_time_visa ON public.processing_time_history(visa_id);
CREATE INDEX idx_proc_time_date ON public.processing_time_history(reported_date);
CREATE INDEX idx_proc_time_official ON public.processing_time_history(is_official);

-- Seed processing times for Tier 1 visas
INSERT INTO public.processing_time_history (visa_id, reported_date, stream_name, min_months, max_months, median_months, source, is_official) VALUES
((SELECT id FROM public.visas WHERE subclass = '189'), '2026-02-01', 'points-tested', 8, 18, 13, 'DHA official', true),
((SELECT id FROM public.visas WHERE subclass = '190'), '2026-02-01', 'state-nominated', 9, 19, 14, 'DHA official', true),
((SELECT id FROM public.visas WHERE subclass = '491'), '2026-02-01', 'state-nominated', 12, 25, 18, 'DHA official', true),
((SELECT id FROM public.visas WHERE subclass = '820/801'), '2026-02-01', 'onshore-partner', 18, 30, 24, 'DHA official', true),
((SELECT id FROM public.visas WHERE subclass = '309/100'), '2026-02-01', 'offshore-partner', 15, 26, 20, 'DHA official', true),
((SELECT id FROM public.visas WHERE subclass = '500'), '2026-02-01', 'student', 1, 4, 2, 'DHA official', true),
((SELECT id FROM public.visas WHERE subclass = '600'), '2026-02-01', 'visitor', 0, 1, 0, 'DHA official', true),
((SELECT id FROM public.visas WHERE subclass = '482'), '2026-02-01', 'medium-term', 0, 2, 1, 'DHA official', true);

-- Verify
SELECT COUNT(*) as processing_entries FROM public.processing_time_history;
