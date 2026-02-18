/*
  # Email Notification System Updates

  1. Updates to `notification_preferences` table:
     - Add `email_lawyer_status_update` (boolean, default true)
     - Add `email_new_message` (boolean, default true)
     - Add `email_payment_receipt` (boolean, default true)

  2. Updates to `notification_logs` (implicit via use of existing table):
     - No schema changes needed, just usage.
*/

DO $$
BEGIN
  -- Add email_lawyer_status_update column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'email_lawyer_status_update') THEN
    ALTER TABLE public.notification_preferences ADD COLUMN email_lawyer_status_update boolean DEFAULT true;
  END IF;

  -- Add email_new_message column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'email_new_message') THEN
    ALTER TABLE public.notification_preferences ADD COLUMN email_new_message boolean DEFAULT true;
  END IF;

  -- Add email_payment_receipt column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'email_payment_receipt') THEN
    ALTER TABLE public.notification_preferences ADD COLUMN email_payment_receipt boolean DEFAULT true;
  END IF;

END $$;
