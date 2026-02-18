/*
  # Lawyer Reviews System

  1. New Tables
    - `public.lawyer_reviews`
      - `id` (uuid, PK)
      - `lawyer_id` (uuid, FK lawyer.profiles)
      - `user_id` (uuid, FK auth.users)
      - `booking_id` (uuid, FK public.bookings, unique)
      - `rating` (integer, 1-5)
      - `review_text` (text)
      - `reply_text` (text, nullable)
      - `replied_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `lawyer_reviews`
    - Policy: Reviews are viewable by everyone
    - Policy: Users can insert reviews for their own bookings
    - Policy: Lawyers can update (reply to) reviews for themselves

  3. Views
    - `public.lawyer_ratings` for aggregated stats
*/

CREATE TABLE IF NOT EXISTS public.lawyer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  reply_text text,
  replied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(booking_id)
);

-- Triggers for updated_at
CREATE TRIGGER lawyer_reviews_updated_at
  BEFORE UPDATE ON public.lawyer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lawyer_reviews_lawyer ON public.lawyer_reviews(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_reviews_user ON public.lawyer_reviews(user_id);

-- RLS
ALTER TABLE public.lawyer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.lawyer_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert reviews for their own bookings"
  ON public.lawyer_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update their own reviews"
  ON public.lawyer_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Lawyers can reply to reviews"
  ON public.lawyer_reviews FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM lawyer.profiles lp
    WHERE lp.id = lawyer_reviews.lawyer_id
    AND lp.profile_id = auth.uid()
  ));

-- View for stats
CREATE OR REPLACE VIEW public.lawyer_ratings AS
SELECT
  lawyer_id,
  count(*) as review_count,
  round(avg(rating), 1) as average_rating
FROM public.lawyer_reviews
GROUP BY lawyer_id;

GRANT SELECT ON public.lawyer_ratings TO anon, authenticated;
