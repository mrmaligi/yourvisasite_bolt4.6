import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Profile } from '../types/database';

export function useProfile() {
  const { user, profile: contextProfile, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(contextProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setProfile(contextProfile);
  }, [contextProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        // Ensure we use 'id' (PK) and not 'user_id' for profiles table updates
        .eq('id', user.id)
        .select()
        .maybeSingle();

      if (updateError) throw updateError;

      setProfile(data);
      await refreshProfile(); // Sync with context

      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { profile, updateProfile, loading, error };
}
