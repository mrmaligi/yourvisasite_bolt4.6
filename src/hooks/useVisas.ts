import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Visa, TrackerStats, VisaRequirement, TrackerEntry } from '../types/database';
import { PostgrestError } from '@supabase/supabase-js';

export interface VisaWithStats extends Visa {
  tracker_stats: TrackerStats | null;
  visa_requirements?: VisaRequirement | null;
}

interface UseVisasFilters {
  search?: string;
  country?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

interface UseVisasResult {
  visas: VisaWithStats[];
  loading: boolean;
  error: PostgrestError | null;
  total: number;
}

export function useVisas(
  arg1?: string | UseVisasFilters,
  argCountry?: string,
  argCategory?: string
): UseVisasResult {
  const [visas, setVisas] = useState<VisaWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [total, setTotal] = useState(0);

  // Parse arguments to support both signatures
  let search = '';
  let country = '';
  let category = '';
  let page = 1;
  let pageSize = 10;

  if (typeof arg1 === 'object' && arg1 !== null) {
    search = arg1.search || '';
    country = arg1.country || '';
    category = arg1.category || '';
    page = arg1.page || 1;
    pageSize = arg1.pageSize || 10;
  } else {
    search = arg1 || '';
    country = argCountry || '';
    category = argCategory || '';
  }

  useEffect(() => {
    const fetchVisas = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('visas')
          .select('*, tracker_stats(*)', { count: 'exact' })
          .eq('is_active', true);

        // Always filter by Australia
        query = query.eq('country', 'Australia');
        if (category) {
          query = query.eq('category', category);
        }
        if (search) {
          query = query.or(`name.ilike.%${search}%,subclass.ilike.%${search}%`);
        }

        // Pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to).order('name');

        const { data, error: fetchError, count } = await query;

        if (fetchError) {
          setError(fetchError);
          console.error('Error fetching visas:', fetchError);
        } else {
          setVisas(
            (data || []).map((v: any) => ({
              ...v,
              tracker_stats: Array.isArray(v.tracker_stats) ? v.tracker_stats[0] || null : v.tracker_stats,
            })) as VisaWithStats[]
          );
          if (count !== null) setTotal(count);
        }
      } catch (err: any) {
        console.error('Unexpected error fetching visas:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisas();
  }, [search, country, category, page, pageSize]);

  return { visas, loading, error, total };
}

export function useVisa(id: string | undefined) {
  const [visa, setVisa] = useState<VisaWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('visas')
        .select('*, tracker_stats(*), visa_requirements(*)')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching visa:', error);
        setError(error);
      }

      if (data) {
        const ts = Array.isArray(data.tracker_stats) ? data.tracker_stats[0] || null : data.tracker_stats;
        const reqs = Array.isArray(data.visa_requirements) ? data.visa_requirements[0] || null : data.visa_requirements;
        
        setVisa({ 
          ...data, 
          tracker_stats: ts,
          visa_requirements: reqs
        } as VisaWithStats);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  return { visa, loading, error };
}

// Legacy/Auxiliary hooks
export function useVisaTrackerEntries(visaId: string | undefined) {
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visaId) return;

    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tracker_entries')
        .select('*')
        .eq('visa_id', visaId)
        .order('decision_date', { ascending: false });

      if (error) {
        console.error('Error fetching tracker entries:', error);
      } else {
        setEntries(data as TrackerEntry[]);
      }
      setLoading(false);
    };
    fetch();
  }, [visaId]);

  return { entries, loading };
}

export function useTrackerStats() {
  const [stats, setStats] = useState<(Visa & { tracker_stats: TrackerStats })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('visas')
        .select('*, tracker_stats!inner(*)')
        .eq('is_active', true)
        .order('name');
        
      if (error) {
        console.error('Error fetching tracker stats:', error);
      }

      setStats(
        (data || []).map((v: any) => ({
          ...v,
          tracker_stats: Array.isArray(v.tracker_stats) ? v.tracker_stats[0] : v.tracker_stats,
        })) as (Visa & { tracker_stats: TrackerStats })[]
      );
      setLoading(false);
    };
    fetch();
  }, []);

  return { stats, loading };
}
