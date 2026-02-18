import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function useSavedVisas() {
  const { user } = useAuth();
  const [savedVisaIds, setSavedVisaIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    if (!user) {
      setSavedVisaIds(new Set());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_visas')
        .select('visa_id')
        .eq('user_id', user.id);

      if (error) {
        // Gracefully handle missing table
        if (error.code === '42P01') {
          console.warn('saved_visas table missing, treating as empty.');
        } else {
          console.error('Error fetching saved visas:', error);
        }
        setSavedVisaIds(new Set());
      } else {
        setSavedVisaIds(new Set((data || []).map((d) => d.visa_id)));
      }
    } catch (err) {
      console.error('Unexpected error fetching saved visas:', err);
      setSavedVisaIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const toggleSave = useCallback(
    async (visaId: string) => {
      if (!user) return false;

      const isSaved = savedVisaIds.has(visaId);

      try {
        if (isSaved) {
          // Optimistic update
          setSavedVisaIds((prev) => {
            const next = new Set(prev);
            next.delete(visaId);
            return next;
          });

          const { error } = await supabase
            .from('saved_visas')
            .delete()
            .eq('user_id', user.id)
            .eq('visa_id', visaId);

          if (error) {
            console.error('Error removing saved visa:', error);
            // Revert
            setSavedVisaIds((prev) => new Set(prev).add(visaId));
            return false;
          }
          return true;
        } else {
          // Optimistic update
          setSavedVisaIds((prev) => new Set(prev).add(visaId));

          const { error } = await supabase
            .from('saved_visas')
            .insert({ user_id: user.id, visa_id: visaId });

          if (error) {
            console.error('Error saving visa:', error);
            // Revert
            setSavedVisaIds((prev) => {
              const next = new Set(prev);
              next.delete(visaId);
              return next;
            });
            return false;
          }
          return true;
        }
      } catch (err) {
        console.error('Unexpected error in toggleSave:', err);
        // Revert to safe state (fetch from server)
        fetchSaved();
        return false;
      }
    },
    [user, savedVisaIds, fetchSaved]
  );

  const isSaved = useCallback(
    (visaId: string) => savedVisaIds.has(visaId),
    [savedVisaIds]
  );

  return { savedVisaIds, isSaved, toggleSave, loading, refresh: fetchSaved };
}
