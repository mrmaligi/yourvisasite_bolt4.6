-- ANZSCO Occupations Insert Script
-- Run this in Supabase SQL Editor

-- Insert ANZSCO occupations (managers)
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('111111', 'Chief Executive or Managing Director', 1, '1', '111', '1111', 'IML', true, false, true, false),
('111211', 'Corporate General Manager', 1, '1', '111', '1112', 'IML', true, false, true, false),
('111212', 'Defence Force Senior Officer', 1, '1', '111', '1112', NULL, false, false, false, false),
('111311', 'Local Government Legislator', 1, '1', '111', '1113', NULL, false, false, false, false),
('111312', 'Member of Parliament', 1, '1', '111', '1113', NULL, false, false, false, false),
('111399', 'Legislators nec', 1, '1', '111', '1113', NULL, false, false, false, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert Farmers
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('121111', 'Aquaculture Farmer', 1, '1', '121', '1211', 'VETASSESS', true, false, true, false),
('121211', 'Cotton Grower', 1, '1', '121', '1212', 'VETASSESS', true, false, true, false),
('121213', 'Fruit or Nut Grower', 1, '1', '121', '1212', 'VETASSESS', true, false, true, false),
('121214', 'Grain, Oilseed or Pasture Grower', 1, '1', '121', '1212', 'VETASSESS', true, false, true, false),
('121216', 'Mixed Crop Farmer', 1, '1', '121', '1212', 'VETASSESS', true, false, true, false),
('121217', 'Sugar Cane Grower', 1, '1', '121', '1212', 'VETASSESS', true, false, true, false),
('121312', 'Beef Cattle Farmer', 1, '1', '121', '1213', 'VETASSESS', true, false, true, false),
('121313', 'Dairy Cattle Farmer', 1, '1', '121', '1213', 'VETASSESS', true, false, true, false),
('121316', 'Horse Breeder', 1, '1', '121', '1213', 'VETASSESS', true, false, true, false),
('121322', 'Sheep Farmer', 1, '1', '121', '1213', 'VETASSESS', true, false, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert Specialist Managers
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('131114', 'Public Relations Manager', 1, '1', '131', '1311', 'IML', true, false, true, false),
('132211', 'Finance Manager', 1, '1', '132', '1322', 'CPAA/CAANZ/IPA', false, true, true, false),
('132311', 'Human Resource Manager', 1, '1', '132', '1323', 'IML', false, true, true, false),
('133111', 'Construction Project Manager', 1, '1', '133', '1331', 'VETASSESS', true, false, true, false),
('133211', 'Engineering Manager', 1, '1', '133', '1332', 'EA/IML', true, false, true, false),
('133611', 'Supply and Distribution Manager', 1, '1', '133', '1336', 'IML', false, true, true, false),
('133612', 'Procurement Manager', 1, '1', '133', '1336', 'IML', true, false, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert Health and Welfare Managers
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('134111', 'Child Care Centre Manager', 1, '1', '134', '1341', 'ACECQA', true, false, true, true),
('134212', 'Nursing Clinical Director', 1, '1', '134', '1342', 'ANMAC', true, false, true, false),
('134214', 'Welfare Centre Manager', 1, '1', '134', '1342', 'ACWA', true, false, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert ICT Managers
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('135111', 'Chief Information Officer', 1, '1', '135', '1351', 'ACS', true, false, false, false),
('135112', 'ICT Project Manager', 1, '1', '135', '1351', 'ACS', false, true, true, false),
('135199', 'ICT Managers nec', 1, '1', '135', '1351', 'ACS', false, true, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert ICT Professionals
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('261111', 'ICT Business Analyst', 1, '2', '261', '2611', 'ACS', true, false, true, false),
('261112', 'Systems Analyst', 1, '2', '261', '2611', 'ACS', true, false, true, false),
('261211', 'Multimedia Specialist', 1, '2', '261', '2612', 'ACS', true, false, true, false),
('261212', 'Web Developer', 1, '2', '261', '2612', 'ACS', true, false, true, false),
('261311', 'Analyst Programmer', 1, '2', '261', '2613', 'ACS', true, false, true, false),
('261312', 'Developer Programmer', 1, '2', '261', '2613', 'ACS', true, false, true, false),
('261313', 'Software Engineer', 1, '2', '261', '2613', 'ACS', true, false, true, true),
('261314', 'Software Tester', 1, '2', '261', '2613', 'ACS', true, false, true, false),
('261399', 'Software and Applications Programmers nec', 1, '2', '261', '2613', 'ACS', true, false, true, false),
('261411', 'Database Administrator', 1, '2', '261', '2614', 'ACS', true, false, true, false),
('261412', 'ICT Security Specialist', 1, '2', '261', '2614', 'ACS', true, false, true, true),
('261413', 'Systems Administrator', 1, '2', '261', '2614', 'ACS', true, false, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert Telecommunications Professionals
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('263111', 'Computer Network and Systems Engineer', 1, '2', '263', '2631', 'ACS', true, false, true, false),
('263112', 'Network Administrator', 1, '2', '263', '2631', 'ACS', true, false, true, false),
('263113', 'Network Analyst', 1, '2', '263', '2631', 'ACS', true, false, true, false),
('263311', 'Telecommunications Engineer', 1, '2', '263', '2633', 'EA', true, false, true, false),
('263312', 'Telecommunications Network Engineer', 1, '2', '263', '2633', 'EA', true, false, true, false),
('263411', 'Electronics Engineer', 1, '2', '263', '2634', 'EA', true, false, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert Engineers
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('233111', 'Chemical Engineer', 1, '2', '233', '2331', 'EA', true, false, true, false),
('233112', 'Materials Engineer', 1, '2', '233', '2331', 'EA', true, false, true, false),
('233211', 'Civil Engineer', 1, '2', '233', '2332', 'EA', true, false, true, true),
('233212', 'Geotechnical Engineer', 1, '2', '233', '2332', 'EA', true, false, true, false),
('233213', 'Quantity Surveyor', 1, '2', '233', '2332', 'AIQS', true, false, true, true),
('233214', 'Structural Engineer', 1, '2', '233', '2332', 'EA', true, false, true, false),
('233215', 'Transport Engineer', 1, '2', '233', '2332', 'EA', true, false, true, false),
('233311', 'Electrical Engineer', 1, '2', '233', '2333', 'EA', true, false, true, false),
('233411', 'Electronics Engineer', 1, '2', '233', '2334', 'EA', true, false, true, false),
('233511', 'Industrial Engineer', 1, '2', '233', '2335', 'EA', true, false, true, false),
('233512', 'Mechanical Engineer', 1, '2', '233', '2335', 'EA', true, false, true, true),
('233513', 'Production or Plant Engineer', 1, '2', '233', '2335', 'EA', true, false, true, false),
('233611', 'Mining Engineer (excluding Petroleum)', 1, '2', '233', '2336', 'EA', true, false, true, false),
('233612', 'Petroleum Engineer', 1, '2', '233', '2336', 'EA', true, false, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert Medical Practitioners
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('253111', 'General Practitioner', 1, '2', '253', '2531', 'MBA', true, false, true, true),
('253112', 'Resident Medical Officer', 1, '2', '253', '2531', 'MBA', true, false, true, false),
('253211', 'Anaesthetist', 1, '2', '253', '2532', 'MBA', true, false, true, false),
('253311', 'Specialist Physician (General Medicine)', 1, '2', '253', '2533', 'MBA', true, false, true, false),
('253312', 'Cardiologist', 1, '2', '253', '2533', 'MBA', true, false, true, false),
('253411', 'Psychiatrist', 1, '2', '253', '2534', 'MBA', true, false, true, false),
('253511', 'Surgeon (General)', 1, '2', '253', '2535', 'MBA', true, false, true, false),
('253912', 'Emergency Medicine Specialist', 1, '2', '253', '2539', 'MBA', true, false, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert Nurses
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('254411', 'Nurse Practitioner', 1, '2', '254', '2544', 'ANMAC', true, false, true, true),
('254412', 'Registered Nurse (Aged Care)', 1, '2', '254', '2544', 'ANMAC', true, false, true, true),
('254415', 'Registered Nurse (Critical Care and Emergency)', 1, '2', '254', '2544', 'ANMAC', true, false, true, true),
('254418', 'Registered Nurse (Medical)', 1, '2', '254', '2544', 'ANMAC', true, false, true, true),
('254422', 'Registered Nurse (Mental Health)', 1, '2', '254', '2544', 'ANMAC', true, false, true, true),
('254424', 'Registered Nurse (Surgical)', 1, '2', '254', '2544', 'ANMAC', true, false, true, true),
('254499', 'Registered Nurses nec', 1, '2', '254', '2544', 'ANMAC', true, false, true, true)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert Teachers
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('241111', 'Early Childhood (Pre-primary School) Teacher', 1, '2', '241', '2411', 'AITSL', true, false, true, true),
('241213', 'Primary School Teacher', 1, '2', '241', '2412', 'AITSL', true, false, true, false),
('241411', 'Secondary School Teacher', 1, '2', '241', '2414', 'AITSL', true, false, true, false),
('241511', 'Special Needs Teacher', 1, '2', '241', '2415', 'AITSL', true, false, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- Insert Trades Workers
INSERT INTO public.anzsco_occupations (code, title, skill_level, major_group, minor_group, unit_group, assessing_authority, mltssl, stsol, regional, pmsol) VALUES
('331111', 'Bricklayer', 3, '3', '331', '3311', 'TRA', true, false, true, false),
('331211', 'Carpenter and Joiner', 3, '3', '331', '3312', 'TRA', true, false, true, false),
('331212', 'Carpenter', 3, '3', '331', '3312', 'TRA', true, false, true, false),
('332211', 'Painting Trades Worker', 3, '3', '332', '3322', 'TRA', true, false, true, false),
('334111', 'Plumber (General)', 3, '3', '334', '3341', 'TRA', true, false, true, true),
('341111', 'Electrician (General)', 3, '3', '341', '3411', 'TRA', true, false, true, true),
('351311', 'Chef', 2, '3', '351', '3513', 'TRA', true, false, true, true),
('351411', 'Cook', 3, '3', '351', '3514', 'TRA', true, false, true, false)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  skill_level = EXCLUDED.skill_level,
  assessing_authority = EXCLUDED.assessing_authority,
  mltssl = EXCLUDED.mltssl,
  stsol = EXCLUDED.stsol,
  regional = EXCLUDED.regional,
  pmsol = EXCLUDED.pmsol,
  updated_at = NOW();

-- View results
SELECT COUNT(*) as total_occupations FROM public.anzsco_occupations;
SELECT major_group, COUNT(*) as count FROM public.anzsco_occupations GROUP BY major_group ORDER BY major_group;
SELECT COUNT(*) as mltssl_count FROM public.anzsco_occupations WHERE mltssl = true;
SELECT COUNT(*) as pmsol_count FROM public.anzsco_occupations WHERE pmsol = true;
