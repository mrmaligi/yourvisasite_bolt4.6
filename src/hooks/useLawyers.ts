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
           console.warn('Error fetching lawyers from lawyer schema, trying public.lawyer_profiles fallback:', fetchError);

           // Fallback query to public.lawyer_profiles
           let fallbackQuery = supabase
              .from('lawyer_profiles')
              .select('*, profiles:user_id!inner(*)')
              .eq('is_verified', true);

           if (specialization) {
              fallbackQuery = fallbackQuery.contains('practice_areas', [specialization]);
           }

           const { data: fallbackData, error: fallbackError } = await fallbackQuery;

           if (fallbackError) throw fallbackError;

           // Map data to match VerifiedLawyer interface
           // user_id -> profile_id
           const mappedData = (fallbackData as any[]).map((item) => ({
               ...item,
               profile_id: item.user_id, // Map user_id to profile_id
               profiles: item.profiles, // Joined profile data
           }));

           setLawyers(mappedData as unknown as VerifiedLawyer[]);
           return;
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
