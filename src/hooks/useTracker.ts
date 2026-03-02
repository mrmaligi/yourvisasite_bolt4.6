import { useState, useEffect } from 'react';
import { supabase, fetchWithRetry } from '../lib/supabase';
import type { TrackerStats, Visa } from '../types/database';

export interface TrackerStatWithVisa extends TrackerStats {
  visas: Visa | null;
}

export function useTracker() {
  const [stats, setStats] = useState<TrackerStatWithVisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await fetchWithRetry(() => supabase
          .from('tracker_stats')
          .select('*, visas(*)')
          .order('total_entries', { ascending: false }));

        if (fetchError) throw fetchError;

        setStats(data as TrackerStatWithVisa[]);
      } catch (err: any) {
        console.error('Error fetching tracker stats:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
