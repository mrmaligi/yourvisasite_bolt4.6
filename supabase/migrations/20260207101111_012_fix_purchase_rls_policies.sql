/*
  # Fix Purchase RLS Policies

  1. Changes
    - Add INSERT policy for user_visa_purchases table to allow authenticated users to create their own purchases
    - This enables the demo purchase flow where users can unlock premium content

  2. Security
    - Users can only create purchases for themselves (user_id must match auth.uid())
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_visa_purchases' 
    AND policyname = 'Users can create own purchases'
  ) THEN
    CREATE POLICY "Users can create own purchases"
      ON user_visa_purchases
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;
