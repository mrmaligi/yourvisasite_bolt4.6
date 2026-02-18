ALTER TABLE public.visa_premium_content
ADD COLUMN IF NOT EXISTS application_example_json JSONB;
