import { supabase, fetchWithRetry } from '../supabase';
import type { Profile, VerificationStatus } from '../../types/database';
import { PostgrestError } from '@supabase/supabase-js';

export interface ProfileWithLawyer extends Profile {
  lawyer_profiles?: { verification_status: VerificationStatus }[] | null;
}

export class ProfileRepository {
  async findById(id: string): Promise<{ data: ProfileWithLawyer | null; error: PostgrestError | null }> {
    const { data, error } = await fetchWithRetry(() => supabase
      .from('profiles')
      .select('*, lawyer_profiles(verification_status)')
      .eq('id', id)
      .maybeSingle());

    return { data: data as ProfileWithLawyer, error };
  }

  async update(id: string, updates: Partial<Profile>): Promise<{ data: Profile | null; error: PostgrestError | null }> {
    const { data, error } = await fetchWithRetry(() => supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single());

    return { data, error };
  }
}
