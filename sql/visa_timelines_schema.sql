-- Create visa_timelines table for scraped and user-submitted data
CREATE TABLE IF NOT EXISTS public.visa_timelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visa_subclass VARCHAR(10) NOT NULL,
  anzsco_code VARCHAR(10) DEFAULT 'N/A',
  location VARCHAR(20) CHECK (location IN ('onshore', 'offshore')),
  date_lodged DATE NOT NULL,
  date_granted DATE,
  processing_days INTEGER,
  had_medicals BOOLEAN DEFAULT FALSE,
  had_s56 BOOLEAN DEFAULT FALSE,
  points INTEGER,
  source VARCHAR(50) DEFAULT 'user', -- 'user', 'reddit', 'facebook', etc.
  notes TEXT,
  url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  flagged BOOLEAN DEFAULT FALSE,
  outlier_flag BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_timelines_visa ON public.visa_timelines(visa_subclass);
CREATE INDEX IF NOT EXISTS idx_timelines_anzsco ON public.visa_timelines(anzsco_code);
CREATE INDEX IF NOT EXISTS idx_timelines_location ON public.visa_timelines(location);
CREATE INDEX IF NOT EXISTS idx_timelines_submitted ON public.visa_timelines(submitted_at);
CREATE INDEX IF NOT EXISTS idx_timelines_verified ON public.visa_timelines(verified);

-- Enable RLS
ALTER TABLE public.visa_timelines ENABLE ROW LEVEL SECURITY;

-- Allow read access to all
CREATE POLICY "Allow read access to visa_timelines" 
  ON public.visa_timelines 
  FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Allow insert for anonymous users (no auth required)
CREATE POLICY "Allow anonymous insert to visa_timelines" 
  ON public.visa_timelines 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (source = 'anonymous_user' OR source = 'user');

-- Allow insert for authenticated users
CREATE POLICY "Allow authenticated insert to visa_timelines" 
  ON public.visa_timelines 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Allow update for admins only
CREATE POLICY "Allow admin update to visa_timelines" 
  ON public.visa_timelines 
  FOR UPDATE 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create view for clean data (no outliers, verified only)
CREATE OR REPLACE VIEW public.clean_timelines AS
SELECT *
FROM public.visa_timelines
WHERE outlier_flag = FALSE 
  AND flagged = FALSE
  AND verified = TRUE;

-- Create materialized view for statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS public.timeline_stats AS
SELECT 
  visa_subclass,
  anzsco_code,
  location,
  COUNT(*) as total_entries,
  AVG(processing_days) as avg_days,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY processing_days) as median_days,
  MIN(processing_days) as min_days,
  MAX(processing_days) as max_days,
  STDDEV(processing_days) as std_dev_days,
  AVG(CASE WHEN submitted_at > NOW() - INTERVAL '60 days' THEN processing_days END) as recent_avg_days
FROM public.visa_timelines
WHERE outlier_flag = FALSE AND flagged = FALSE
GROUP BY visa_subclass, anzsco_code, location;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_timeline_stats ON public.timeline_stats(visa_subclass, anzsco_code, location);

-- Function to refresh stats
CREATE OR REPLACE FUNCTION refresh_timeline_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.timeline_stats;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO public.visa_timelines (visa_subclass, anzsco_code, location, date_lodged, date_granted, processing_days, had_medicals, had_s56, source, verified)
VALUES
('189', '261312', 'offshore', '2023-06-15', '2024-01-20', 219, true, false, 'reddit', true),
('189', '261312', 'offshore', '2023-07-10', '2024-02-05', 210, true, true, 'reddit', true),
('189', '261312', 'onshore', '2023-08-01', '2024-02-15', 198, false, false, 'user', true),
('190', '233512', 'onshore', '2023-05-20', '2023-12-10', 204, true, false, 'reddit', true),
('190', '233512', 'offshore', '2023-09-01', '2024-03-15', 196, true, true, 'user', true),
('820', 'N/A', 'onshore', '2022-12-01', '2024-01-10', 406, true, false, 'facebook', true),
('820', 'N/A', 'onshore', '2023-03-15', '2024-02-28', 350, true, true, 'reddit', true),
('500', 'N/A', 'offshore', '2024-01-05', '2024-02-01', 27, true, false, 'user', true),
('189', '261312', 'offshore', '2023-10-01', '2024-04-01', 183, false, false, 'reddit', true),
('189', '261111', 'onshore', '2023-11-15', '2024-05-01', 168, true, false, 'user', true)
ON CONFLICT DO NOTHING;

-- Refresh stats
SELECT refresh_timeline_stats();

-- View results
SELECT * FROM public.timeline_stats LIMIT 10;
