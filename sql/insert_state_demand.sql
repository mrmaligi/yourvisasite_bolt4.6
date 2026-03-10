-- Insert State Demand Data
INSERT INTO public.anzsco_state_demand (anzsco_code, state, demand_level, avg_salary_min, avg_salary_max, job_growth_rate) VALUES
-- NSW
('261312', 'NSW', 'high', 95000, 150000, 12.5),
('233512', 'NSW', 'high', 90000, 140000, 8.3),
('253111', 'NSW', 'high', 180000, 350000, 15.2),
('254499', 'NSW', 'high', 75000, 110000, 11.8),
('241111', 'NSW', 'high', 70000, 95000, 9.5),
('261313', 'NSW', 'high', 100000, 160000, 14.2),
('233211', 'NSW', 'high', 85000, 130000, 7.8),
('351311', 'NSW', 'high', 65000, 85000, 6.5),

-- VIC
('261312', 'VIC', 'high', 92000, 145000, 11.8),
('233512', 'VIC', 'medium', 85000, 130000, 6.2),
('253111', 'VIC', 'high', 175000, 340000, 14.8),
('351311', 'VIC', 'high', 62000, 82000, 7.2),
('241111', 'VIC', 'high', 68000, 92000, 10.1),
('254499', 'VIC', 'high', 72000, 105000, 12.3),
('233213', 'VIC', 'high', 80000, 120000, 8.5),

-- QLD
('261312', 'QLD', 'medium', 88000, 135000, 10.2),
('233512', 'QLD', 'high', 90000, 140000, 9.8),
('341111', 'QLD', 'high', 75000, 95000, 8.5),
('253111', 'QLD', 'high', 170000, 320000, 13.5),
('241111', 'QLD', 'high', 65000, 88000, 8.9),
('334111', 'QLD', 'high', 78000, 100000, 7.2),

-- WA
('233512', 'WA', 'high', 95000, 150000, 11.5),
('233611', 'WA', 'high', 110000, 180000, 15.8),
('321211', 'WA', 'high', 70000, 90000, 9.2),
('261312', 'WA', 'medium', 90000, 140000, 9.5),
('341111', 'WA', 'high', 80000, 100000, 8.8),
('253111', 'WA', 'high', 185000, 360000, 16.2),

-- SA
('261312', 'SA', 'medium', 82000, 125000, 8.5),
('254499', 'SA', 'high', 72000, 105000, 13.2),
('241111', 'SA', 'high', 65000, 85000, 11.5),
('351311', 'SA', 'high', 60000, 78000, 7.8),
('233512', 'SA', 'medium', 82000, 125000, 5.5),

-- TAS
('241111', 'TAS', 'high', 68000, 90000, 12.5),
('254499', 'TAS', 'high', 70000, 95000, 14.8),
('351311', 'TAS', 'high', 58000, 75000, 8.2),
('261312', 'TAS', 'low', 75000, 115000, 4.5),

-- ACT
('261312', 'ACT', 'high', 95000, 145000, 11.2),
('221111', 'ACT', 'medium', 70000, 100000, 6.8),
('241111', 'ACT', 'medium', 72000, 95000, 7.5),
('253111', 'ACT', 'high', 170000, 310000, 12.8),

-- NT
('254499', 'NT', 'high', 85000, 120000, 18.5),
('241111', 'NT', 'high', 75000, 98000, 16.2),
('351311', 'NT', 'high', 68000, 88000, 12.8),
('341111', 'NT', 'high', 85000, 110000, 14.5),
('261312', 'NT', 'low', 80000, 120000, 5.2)
ON CONFLICT (anzsco_code, state) DO UPDATE SET
  demand_level = EXCLUDED.demand_level,
  avg_salary_min = EXCLUDED.avg_salary_min,
  avg_salary_max = EXCLUDED.avg_salary_max,
  job_growth_rate = EXCLUDED.job_growth_rate,
  last_updated = NOW();

-- View results
SELECT state, COUNT(*) as occupations, AVG(avg_salary_max) as avg_max_salary
FROM public.anzsco_state_demand 
GROUP BY state 
ORDER BY state;
