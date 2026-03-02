import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { LawyerProfile, Profile } from '../types/database';

export interface VerifiedLawyer extends LawyerProfile {
  profiles: Profile | null; // Joined data
}

export function useLawyers(specialization?: string) {
  const [lawyers, setLawyers] = useState<VerifiedLawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('lawyer_profiles')
          .select('*, profiles:user_id(*)')
          .eq('is_verified', true);

        if (specialization) {
          query = query.contains('practice_areas', [specialization]);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
           console.warn('Error fetching lawyers:', fetchError);
           throw fetchError;
        }

        setLawyers(data as unknown as VerifiedLawyer[]);
      } catch (err: any) {
        console.error('Error fetching lawyers:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [specialization]);

  return { lawyers, loading, error };
}
