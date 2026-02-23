import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Booking } from '../types/database';

export interface BookingWithDetails extends Booking {
  lawyer_name?: string;
  lawyer_jurisdiction?: string;
  user_name?: string;
  user_phone?: string;
  start_time?: string;
}

export function useBookings() {
  const { user, role } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        let bookingQuery = supabase.from('bookings').select('*');

        if (role === 'lawyer') {
          // Lawyer needs to find their lawyer profile ID first
          const { data: lawyerProfile, error: lpError } = await supabase
            .schema('lawyer')
            .from('profiles')
            .select('id')
            .eq('profile_id', user.id)
            .maybeSingle();

          if (lpError) throw lpError;

          if (lawyerProfile) {
            bookingQuery = bookingQuery.eq('lawyer_id', lawyerProfile.id);
          } else {
            setBookings([]);
            setLoading(false);
            return;
          }
        } else {
          // Regular user: fetch their own bookings
          bookingQuery = bookingQuery.eq('user_id', user.id);
        }

        // Order by created_at desc initially, but we prefer slot start time later
        bookingQuery = bookingQuery.order('created_at', { ascending: false });

        const { data: bookingsData, error: fetchError } = await bookingQuery;

        if (fetchError) throw fetchError;
        if (!bookingsData || bookingsData.length === 0) {
          setBookings([]);
          setLoading(false);
          return;
        }

        // Application-side join to fetch related details
        const lawyerIds = [...new Set(bookingsData.map(b => b.lawyer_id))];
        const userIds = [...new Set(bookingsData.map(b => b.user_id))];
        const slotIds = [...new Set(bookingsData.map(b => b.slot_id).filter(Boolean))];

        // Fetch Slots (for time)
        const { data: slots } = await supabase
          // Explicitly use lawyer schema
          .schema('lawyer')
          .from('consultation_slots')
          .select('id, start_time')
          .in('id', slotIds);

        const slotMap = new Map(slots?.map(s => [s.id, s.start_time]) || []);

        // Fetch Lawyer Profiles (if user)
        let lawyerMap = new Map();
        if (role === 'user' && lawyerIds.length > 0) {
          const { data: lawyerProfiles } = await supabase
            .schema('lawyer')
            .from('profiles')
            .select('id, profile_id, jurisdiction')
            .in('id', lawyerIds);

          if (lawyerProfiles) {
             const profileIds = lawyerProfiles.map(lp => lp.profile_id);
             const { data: profiles } = await supabase
               .from('profiles')
               .select('id, full_name')
               .in('id', profileIds);

             const publicProfileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

             lawyerProfiles.forEach(lp => {
               lawyerMap.set(lp.id, {
                 name: publicProfileMap.get(lp.profile_id),
                 jurisdiction: lp.jurisdiction
               });
             });
          }
        }

        // Fetch User Profiles (if lawyer)
        let userMap = new Map();
        if (role === 'lawyer' && userIds.length > 0) {
           const { data: profiles } = await supabase
             .from('profiles')
             .select('id, full_name, phone')
             .in('id', userIds);

           profiles?.forEach(p => {
             userMap.set(p.id, { name: p.full_name, phone: p.phone });
           });
        }

        // Combine data
        const enrichedBookings: BookingWithDetails[] = bookingsData.map(b => ({
          ...b,
          start_time: slotMap.get(b.slot_id),
          lawyer_name: role === 'user' ? lawyerMap.get(b.lawyer_id)?.name : undefined,
          lawyer_jurisdiction: role === 'user' ? lawyerMap.get(b.lawyer_id)?.jurisdiction : undefined,
          user_name: role === 'lawyer' ? userMap.get(b.user_id)?.name : undefined,
          user_phone: role === 'lawyer' ? userMap.get(b.user_id)?.phone : undefined,
        }));

        // Sort by start time if available, otherwise created_at
        enrichedBookings.sort((a, b) => {
           const dateA = a.start_time ? new Date(a.start_time).getTime() : new Date(a.created_at).getTime();
           const dateB = b.start_time ? new Date(b.start_time).getTime() : new Date(b.created_at).getTime();
           return dateB - dateA; // Descending
        });

        setBookings(enrichedBookings);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, role, refreshTrigger]);

  return { bookings, loading, error, refetch };
}
