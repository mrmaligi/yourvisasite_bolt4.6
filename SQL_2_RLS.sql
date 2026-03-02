-- SQL_2: RLS POLICIES
-- Run this second

ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Visas are viewable by everyone" ON public.visas;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own saved visas" ON public.saved_visas;
DROP POLICY IF EXISTS "Tracker entries are viewable by everyone" ON public.tracker_entries;
DROP POLICY IF EXISTS "Bookings viewable by participants" ON public.bookings;

CREATE POLICY "Visas are viewable by everyone" ON public.visas FOR SELECT USING (true);
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own saved visas" ON public.saved_visas FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Tracker entries are viewable by everyone" ON public.tracker_entries FOR SELECT USING (true);
CREATE POLICY "Bookings viewable by participants" ON public.bookings FOR SELECT USING (user_id = auth.uid());

SELECT 'RLS policies created successfully' as status;
