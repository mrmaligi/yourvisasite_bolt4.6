import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Visa, TrackerStats, VisaRequirement, TrackerEntry } from '../types/database';

export interface VisaWithStats extends Visa {
  tracker_stats: TrackerStats | null;
  visa_requirements?: VisaRequirement | null;
}

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

export function useVisas(search?: string, country?: string, category?: string) {
  const [visas, setVisas] = useState<VisaWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisas = async () => {
      setLoading(true);
      let query = supabase
        .from('visas')
        .select('*, tracker_stats(*)')
        .eq('is_active', true)
        .order('name');

      if (country) {
        query = query.eq('country', country);
      }
      if (category) {
        query = query.eq('category', category);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,subclass_number.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching visas:', error);
      }
      
      setVisas(
        (data || []).map((v: any) => ({
          ...v,
          tracker_stats: Array.isArray(v.tracker_stats) ? v.tracker_stats[0] || null : v.tracker_stats,
        })) as VisaWithStats[]
      );
      setLoading(false);
    };
    fetchVisas();
  }, [search, country, category]);

  return { visas, loading };
}

export function useVisa(id: string | undefined) {
  const [visa, setVisa] = useState<VisaWithStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('visas')
        .select('*, tracker_stats(*), visa_requirements(*)')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching visa:', error);
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

  return { visa, loading };
}

export function useTrackerStats() {
  const [stats, setStats] = useState<(Visa & { tracker_stats: TrackerStats })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('tracker_summary')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching tracker stats:', error);
      }

      setStats(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data || []).map((v: any) => ({
          id: v.id,
          subclass_number: v.subclass_number,
          name: v.name,
          country: v.country,
          category: v.category,
          official_url: v.official_url,
          summary: v.summary,
          processing_fee_description: v.processing_fee_description,
          is_active: v.is_active,
          created_at: v.created_at,
          updated_at: v.updated_at,
          tracker_stats: {
            visa_id: v.id,
            weighted_avg_days: v.weighted_avg_days,
            ewma_days: v.ewma_days,
            median_days: v.median_days,
            p25_days: v.p25_days,
            p75_days: v.p75_days,
            total_entries: v.total_entries || 0,
            last_updated: v.stats_last_updated || v.updated_at,
          },
        })) as (Visa & { tracker_stats: TrackerStats })[]
      );
      setLoading(false);
    };
    fetch();
  }, []);

  return { stats, loading };
}
