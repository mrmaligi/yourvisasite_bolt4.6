-- Optimization for User Dashboard stats
-- Consolidates 4 separate queries into a single RPC call

CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  -- We use user_visa_purchases instead of the non-existent user_visas table
  -- which was a bug in the previous frontend implementation.
  -- Note: We count all purchases regardless of status 'active', matching previous intent of "My Visas"
  SELECT json_build_object(
    'savedVisas', (SELECT count(*) FROM saved_visas WHERE user_id = auth.uid()),
    'myVisas', (SELECT count(*) FROM user_visa_purchases WHERE user_id = auth.uid()),
    'documents', (SELECT count(*) FROM user_documents WHERE user_id = auth.uid()),
    'upcomingConsultations', (SELECT count(*) FROM bookings
                              WHERE user_id = auth.uid()
                              AND scheduled_at >= now()
                              AND status IN ('pending', 'confirmed'))
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_dashboard_stats() TO authenticated;
