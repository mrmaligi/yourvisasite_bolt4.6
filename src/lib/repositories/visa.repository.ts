import { supabase, fetchWithRetry } from '../supabase';
import type { Visa, TrackerStats, VisaRequirement, TrackerEntry } from '../../types/database';
import { PostgrestError } from '@supabase/supabase-js';

export interface VisaWithStats extends Visa {
  tracker_stats: TrackerStats | null;
  visa_requirements?: VisaRequirement | null;
}

export interface VisaFilters {
  search?: string;
  country?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export class VisaRepository {
  async findAll(filters: VisaFilters = {}): Promise<{ data: VisaWithStats[]; count: number | null; error: PostgrestError | null }> {
    let query = supabase
      .from('visas')
      .select('*, tracker_stats(*)', { count: 'exact' })
      .eq('is_active', true);

    if (filters.country) {
      query = query.eq('country', filters.country);
    } else {
      query = query.eq('country', 'Australia'); // Default
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,subclass.ilike.%${filters.search}%`);
    }

    if (filters.page && filters.pageSize) {
      const from = (filters.page - 1) * filters.pageSize;
      const to = from + filters.pageSize - 1;
      query = query.range(from, to);
    }

    query = query.order('name');

    const { data, error, count } = await fetchWithRetry(() => query);

    if (error) {
      return { data: [], count: 0, error };
    }

    const visas = (data || []).map((v: any) => ({
      ...v,
      tracker_stats: Array.isArray(v.tracker_stats) ? v.tracker_stats[0] || null : v.tracker_stats,
    })) as VisaWithStats[];

    return { data: visas, count, error: null };
  }

  async findById(id: string): Promise<{ data: VisaWithStats | null; error: PostgrestError | null }> {
    const { data, error } = await fetchWithRetry(() => supabase
      .from('visas')
      .select('*, tracker_stats(*), visa_requirements(*)')
      .eq('id', id)
      .maybeSingle());

    if (error) return { data: null, error };
    if (!data) return { data: null, error: null };

    const ts = Array.isArray(data.tracker_stats) ? data.tracker_stats[0] || null : data.tracker_stats;
    const reqs = Array.isArray(data.visa_requirements) ? data.visa_requirements[0] || null : data.visa_requirements;

    return {
      data: {
        ...data,
        tracker_stats: ts,
        visa_requirements: reqs
      } as VisaWithStats,
      error: null
    };
  }

  async getTrackerStats(): Promise<{ data: (Visa & { tracker_stats: TrackerStats })[]; error: PostgrestError | null }> {
    const { data, error } = await fetchWithRetry(() => supabase
      .from('visas')
      .select('*, tracker_stats!inner(*)')
      .eq('is_active', true)
      .order('name'));

    if (error) return { data: [], error };

    const stats = (data || []).map((v: any) => ({
      ...v,
      tracker_stats: Array.isArray(v.tracker_stats) ? v.tracker_stats[0] : v.tracker_stats,
    })) as (Visa & { tracker_stats: TrackerStats })[];

    return { data: stats, error: null };
  }

  async findTrackerEntries(visaId: string): Promise<{ data: TrackerEntry[]; error: PostgrestError | null }> {
    const { data, error } = await fetchWithRetry(() => supabase
      .from('tracker_entries')
      .select('*')
      .eq('visa_id', visaId)
      .order('decision_date', { ascending: false }));
    return { data: (data || []) as TrackerEntry[], error };
  }
}
