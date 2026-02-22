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

CREATE TABLE IF NOT EXISTS public.user_visa_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  purchased_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(user_id, visa_id)
);
