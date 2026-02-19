/*
  # Add status column to tracker_entries

  1. Changes
    - Add `status` column to `tracker_entries` with values 'pending' or 'completed'
    - Default to 'completed' for existing entries (they all have decision dates)
    - Make `decision_date` nullable so pending applications can omit it
    - Make `outcome` have a default of 'approved' (kept) and allow null for pending

  2. Purpose
    - Allows users to track pending applications that haven't received a decision yet
    - Users can later update their entry when they receive a decision
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracker_entries' AND column_name = 'status' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.tracker_entries ADD COLUMN status text NOT NULL DEFAULT 'completed'
      CHECK (status IN ('pending', 'completed'));
  END IF;
END $$;

ALTER TABLE public.tracker_entries ALTER COLUMN decision_date DROP NOT NULL;
