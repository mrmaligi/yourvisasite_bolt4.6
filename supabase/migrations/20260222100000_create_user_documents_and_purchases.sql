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

-- Enable RLS
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own documents" 
  ON public.user_documents FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" 
  ON public.user_documents FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" 
  ON public.user_documents FOR DELETE 
  USING (auth.uid() = user_id);

-- Create user_visa_purchases table for premium unlocks
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
