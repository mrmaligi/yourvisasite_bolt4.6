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
    const { data } = await supabase
      .from('saved_visas')
      .select('visa_id')
      .eq('user_id', user.id);
    setSavedVisaIds(new Set((data || []).map((d) => d.visa_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const toggleSave = useCallback(
    async (visaId: string) => {
      if (!user) return false;
      const isSaved = savedVisaIds.has(visaId);
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
    },
    [user, savedVisaIds]
  );

  const isSaved = useCallback(
    (visaId: string) => savedVisaIds.has(visaId),
    [savedVisaIds]
  );

  return { savedVisaIds, isSaved, toggleSave, loading, refresh: fetchSaved };
}
