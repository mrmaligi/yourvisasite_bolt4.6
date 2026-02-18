-- Add reminder_sent column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS reminder_sent boolean DEFAULT false;

-- Add index for efficient reminder queries
CREATE INDEX IF NOT EXISTS idx_bookings_reminder_check 
ON public.bookings(status, reminder_sent, slot_id) 
WHERE status = 'confirmed' AND reminder_sent = false;

COMMENT ON COLUMN public.bookings.reminder_sent IS 'Whether 24-hour reminder email has been sent';
