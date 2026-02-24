import { supabase, fetchWithRetry } from '../supabase';
import type { VisaPremiumContent } from '../../types/database';
import { PostgrestError } from '@supabase/supabase-js';

export class PremiumRepository {
  async findByVisaId(visaId: string): Promise<{ data: VisaPremiumContent[]; error: PostgrestError | null }> {
    const { data, error } = await fetchWithRetry(() => supabase
      .from('visa_premium_content')
      .select('*')
      .eq('visa_id', visaId)
      .order('section_number'));

    return { data: (data || []) as VisaPremiumContent[], error };
  }
}
