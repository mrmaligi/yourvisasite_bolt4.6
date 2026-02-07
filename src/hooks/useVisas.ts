import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Visa, TrackerStats } from '../types/database';

export interface VisaWithStats extends Visa {
  tracker_stats: TrackerStats | null;
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

      if (country) query = query.eq('country', country);
      if (category) query = query.eq('category', category);
      if (search) query = query.or(`name.ilike.%${search}%,subclass_number.ilike.%${search}%`);

      const { data } = await query;
      setVisas(
        (data || []).map((v: Record<string, unknown>) => ({
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
      const { data } = await supabase
        .from('visas')
        .select('*, tracker_stats(*)')
        .eq('id', id)
        .maybeSingle();
      if (data) {
        const ts = Array.isArray(data.tracker_stats) ? data.tracker_stats[0] || null : data.tracker_stats;
        setVisa({ ...data, tracker_stats: ts } as VisaWithStats);
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
      const { data } = await supabase
        .from('visas')
        .select('*, tracker_stats!inner(*)')
        .eq('is_active', true)
        .order('name');
      setStats(
        (data || []).map((v: Record<string, unknown>) => ({
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
