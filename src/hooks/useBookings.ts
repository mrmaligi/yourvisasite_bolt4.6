import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Booking } from '../types/database';

export function useBookings() {
  const { user, role } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Start building query
        let query = supabase.from('bookings').select('*');

        if (role === 'lawyer') {
          // Lawyer needs to find their lawyer profile ID first
          // Assuming lawyer profiles are in 'lawyer' schema based on prompt
          const { data: lawyerProfile, error: lpError } = await supabase
            .schema('lawyer')
            .from('profiles')
            .select('id')
            .eq('profile_id', user.id)
            .maybeSingle();

          if (lpError) {
             console.warn('Error fetching lawyer profile for bookings:', lpError);
             // If schema fails, maybe try public schema fallback or just fail
             throw lpError;
          }

          if (lawyerProfile) {
            query = query.eq('lawyer_id', lawyerProfile.id);
          } else {
            // If lawyer profile not found (e.g. unverified or not set up), return empty
            setBookings([]);
            setLoading(false);
            return;
          }
        } else {
          // Regular user: fetch their own bookings
          query = query.eq('user_id', user.id);
        }

        // Order by scheduled_at desc
        query = query.order('scheduled_at', { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setBookings(data as Booking[]);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, role]);

  return { bookings, loading, error };
}
