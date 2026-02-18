/*
  # Fix Lawyer Schema and Storage Policies

  1. Schema Updates
    - Add lawyer profile columns to public.profiles table (merging lawyer schema into public)
    - Columns: bar_number, jurisdiction, practice_areas, years_experience, bio, hourly_rate_cents, is_verified, verification_status, verification_document_url, rejection_reason, verified_at, verified_by

  2. Storage Policies
    - Update policies for 'avatars' bucket to enforce folder-based ownership
    - Allow public read for avatars
    - Allow authenticated users to upload/update/delete only in their own folder (auth.uid())
*/

-- Ensure verification_status type exists
DO $$ BEGIN
  CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add lawyer columns to public.profiles if they don't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bar_number text DEFAULT '',
ADD COLUMN IF NOT EXISTS jurisdiction text DEFAULT '',
ADD COLUMN IF NOT EXISTS practice_areas text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS years_experience integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS hourly_rate_cents integer,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_status public.verification_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_document_url text,
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS verified_at timestamptz,
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES public.profiles(id);

-- Create index for verified lawyers
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);

-- Fix Storage Policies for 'avatars' bucket
BEGIN;

-- Drop common existing policies to ensure clean slate
DROP POLICY IF EXISTS "Avatar Upload" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Update" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Select" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;

-- Create new policies
-- 1. Public Read
CREATE POLICY "Public Read Avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 2. Authenticated Upload (own folder)
CREATE POLICY "Authenticated Upload Avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Authenticated Update (own folder)
CREATE POLICY "Authenticated Update Avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Authenticated Delete (own folder)
CREATE POLICY "Authenticated Delete Avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

COMMIT;
