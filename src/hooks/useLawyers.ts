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
        // Query lawyer.profiles
        // Assuming 'lawyer' schema based on prompt notation
        // If it fails, fallback to 'lawyer_profiles' table in public schema or handle error

        let query = supabase
          .schema('lawyer')
          .from('profiles')
          .select('*, profiles!inner(*)') // !inner to ensure we get profile data
          .eq('is_verified', true);

        if (specialization) {
          query = query.contains('practice_areas', [specialization]);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
           // Fallback attempt: maybe table is 'lawyer_profiles' in public schema?
           // Or maybe just 'profiles' in 'lawyer' schema without join working?
           console.warn('Error fetching lawyers from lawyer schema, trying fallback might be needed:', fetchError);
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
