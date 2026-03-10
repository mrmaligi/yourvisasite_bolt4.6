-- Create ANZSCO occupations table
CREATE TABLE IF NOT EXISTS public.anzsco_occupations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  skill_level INTEGER,
  major_group VARCHAR(10),
  minor_group VARCHAR(10),
  unit_group VARCHAR(10),
  description TEXT,
  assessing_authority VARCHAR(100),
  mltssl BOOLEAN DEFAULT FALSE,
  stsol BOOLEAN DEFAULT FALSE,
  regional BOOLEAN DEFAULT FALSE,
  pmsol BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_anzsco_code ON public.anzsco_occupations(code);
CREATE INDEX IF NOT EXISTS idx_anzsco_title ON public.anzsco_occupations(title);
CREATE INDEX IF NOT EXISTS idx_anzsco_major_group ON public.anzsco_occupations(major_group);
CREATE INDEX IF NOT EXISTS idx_anzsco_skill_level ON public.anzsco_occupations(skill_level);

-- Enable Row Level Security
ALTER TABLE public.anzsco_occupations ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to anzsco_occupations" 
  ON public.anzsco_occupations 
  FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Allow insert/update only for admins
CREATE POLICY "Allow admin write access to anzsco_occupations" 
  ON public.anzsco_occupations 
  FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create state-based occupation demand table
CREATE TABLE IF NOT EXISTS public.anzsco_state_demand (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anzsco_code VARCHAR(10) REFERENCES public.anzsco_occupations(code),
  state VARCHAR(50) NOT NULL, -- NSW, VIC, QLD, WA, SA, TAS, ACT, NT
  demand_level VARCHAR(20), -- high, medium, low
  avg_salary_min INTEGER,
  avg_salary_max INTEGER,
  job_growth_rate DECIMAL(5,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(anzsco_code, state)
);

CREATE INDEX IF NOT EXISTS idx_state_demand_code ON public.anzsco_state_demand(anzsco_code);
CREATE INDEX IF NOT EXISTS idx_state_demand_state ON public.anzsco_state_demand(state);

-- Enable RLS
ALTER TABLE public.anzsco_state_demand ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to state demand" 
  ON public.anzsco_state_demand 
  FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for anzsco_occupations
DROP TRIGGER IF EXISTS update_anzsco_updated_at ON public.anzsco_occupations;
CREATE TRIGGER update_anzsco_updated_at
  BEFORE UPDATE ON public.anzsco_occupations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
