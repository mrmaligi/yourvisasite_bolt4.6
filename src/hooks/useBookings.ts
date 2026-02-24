import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Fix import path (useAuth is exported from context, or hook? Hook file exists: useAuth.ts but imports from context usually. Wait, previously it imported from './useAuth')
import { bookingService, type BookingWithDetails } from '../lib/services/booking.service';
import { errorHandler } from '../lib/errors/handler';
import type { ApiError } from '../lib/errors/api.error';

// Re-export type
export type { BookingWithDetails };

export function useBookings() {
  const { user, role } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
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
        const data = await bookingService.getBookings(user.id, role || 'user');
        setBookings(data);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(errorHandler(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, role, refreshTrigger]);

  return { bookings, loading, error, refetch };
}
