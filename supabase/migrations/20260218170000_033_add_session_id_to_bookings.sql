-- Migration: Add stripe_checkout_session_id to bookings
-- Track: Consultation Flow

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text;

CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session
ON public.bookings(stripe_checkout_session_id)
WHERE stripe_checkout_session_id IS NOT NULL;
