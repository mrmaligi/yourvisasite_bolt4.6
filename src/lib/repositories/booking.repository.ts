import { supabase, fetchWithRetry } from '../supabase';
import type { Booking, LawyerProfile, Profile } from '../../types/database';
import { PostgrestError } from '@supabase/supabase-js';

export class BookingRepository {
  async findByUserId(userId: string): Promise<{ data: Booking[]; error: PostgrestError | null }> {
    const { data, error } = await fetchWithRetry(() => supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: false }));
    return { data: (data || []) as Booking[], error };
  }

  async findByLawyerId(lawyerId: string): Promise<{ data: Booking[]; error: PostgrestError | null }> {
    const { data, error } = await fetchWithRetry(() => supabase
      .from('bookings')
      .select('*')
      .eq('lawyer_id', lawyerId)
      .order('scheduled_at', { ascending: false }));
    return { data: (data || []) as Booking[], error };
  }

  async findLawyerByProfileId(profileId: string): Promise<{ data: LawyerProfile | null; error: PostgrestError | null }> {
    const { data, error } = await fetchWithRetry(() => supabase
      .schema('lawyer')
      .from('profiles')
      .select('*')
      .eq('profile_id', profileId)
      .maybeSingle());
    return { data: data as LawyerProfile | null, error };
  }

  async findLawyerProfiles(lawyerIds: string[]): Promise<{ data: LawyerProfile[]; error: PostgrestError | null }> {
    if (lawyerIds.length === 0) return { data: [], error: null };
    const { data, error } = await fetchWithRetry(() => supabase
      .schema('lawyer')
      .from('profiles')
      .select('*')
      .in('id', lawyerIds));
    return { data: (data || []) as LawyerProfile[], error };
  }

  async findProfiles(profileIds: string[]): Promise<{ data: Profile[]; error: PostgrestError | null }> {
    if (profileIds.length === 0) return { data: [], error: null };
    const { data, error } = await fetchWithRetry(() => supabase
      .from('profiles')
      .select('*')
      .in('id', profileIds));
    return { data: (data || []) as Profile[], error };
  }
}
