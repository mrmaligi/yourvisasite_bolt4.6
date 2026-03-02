-- Migration 018: Consultation Payment & Calendar Support
-- Add payment tracking and slot reservation fields

-- Add payment columns to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_intent_id text,
ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;

-- Add reservation columns to consultation_slots
ALTER TABLE lawyer.consultation_slots
ADD COLUMN IF NOT EXISTS is_reserved boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS reserved_until timestamptz;

-- Create index for finding reserved slots that need cleanup
CREATE INDEX IF NOT EXISTS idx_slots_reserved_until
ON lawyer.consultation_slots(reserved_until)
WHERE is_reserved = true;

-- Create index for payment lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent
ON public.bookings(payment_intent_id)
WHERE payment_intent_id IS NOT NULL;

-- Add comment explaining payment_status values
COMMENT ON COLUMN public.bookings.payment_status IS 'Values: pending, paid, failed, refunded';
COMMENT ON COLUMN lawyer.consultation_slots.is_reserved IS 'True when user is in checkout process (15-min hold)';
COMMENT ON COLUMN lawyer.consultation_slots.reserved_until IS 'Timestamp when reservation expires';
