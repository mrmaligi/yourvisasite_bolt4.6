-- Fix Storage Bucket for Documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Documents Bucket
DROP POLICY IF EXISTS "User Upload Documents" ON storage.objects;
DROP POLICY IF EXISTS "User Select Documents" ON storage.objects;
DROP POLICY IF EXISTS "User Delete Documents" ON storage.objects;

CREATE POLICY "User Upload Documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "User Select Documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "User Delete Documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Fix Consultation Slots Table
DROP TABLE IF EXISTS public.consultation_slots CASCADE;

CREATE TABLE public.consultation_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lawyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  is_reserved BOOLEAN DEFAULT false,
  reserved_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Consultation Slots
ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Slots are viewable by everyone" ON public.consultation_slots FOR SELECT USING (true);
CREATE POLICY "Lawyers can manage own slots" ON public.consultation_slots FOR ALL USING (lawyer_id = auth.uid());

-- Allow Admins to update profiles (Fix for User Management)
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);
