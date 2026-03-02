-- Migration: Create user_documents and user_visa_purchases tables
-- Created: 2026-02-22

-- user_documents table
CREATE TABLE IF NOT EXISTS public.user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  document_type text,
  mime_type text,
  file_size integer,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" 
  ON public.user_documents FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" 
  ON public.user_documents FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- user_visa_purchases table
CREATE TABLE IF NOT EXISTS public.user_visa_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  purchased_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(user_id, visa_id)
);

ALTER TABLE public.user_visa_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" 
  ON public.user_visa_purchases FOR SELECT 
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_documents TO authenticated;
GRANT ALL ON public.user_visa_purchases TO authenticated;
GRANT ALL ON public.user_documents TO service_role;
GRANT ALL ON public.user_visa_purchases TO service_role;
