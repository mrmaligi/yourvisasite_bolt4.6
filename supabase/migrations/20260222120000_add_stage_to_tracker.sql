/*
  # Add Stage to Tracker Entries

  1. Changes
    - Add `stage` column to `tracker_entries` table.
    - This column tracks the granular status of an application: 'received', 'processing', 'assessment', 'decision'.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracker_entries' AND column_name = 'stage'
  ) THEN
    ALTER TABLE public.tracker_entries
    ADD COLUMN stage text CHECK (stage IN ('received', 'processing', 'assessment', 'decision'));
  END IF;
END $$;
