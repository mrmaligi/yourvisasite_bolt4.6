import { useEffect, useState } from 'react';
import { visaService } from '../lib/services/visa.service';
import { errorHandler } from '../lib/errors/handler';
import type { Visa, TrackerStats, TrackerEntry } from '../types/database';
import type { VisaWithStats } from '../lib/repositories/visa.repository';
import type { ApiError } from '../lib/errors/api.error';

// Re-exporting VisaWithStats for compatibility with existing code
export type { VisaWithStats };

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
  error: ApiError | null;
  total: number;
}

export function useVisas(
  arg1?: string | UseVisasFilters,
  argCountry?: string,
  argCategory?: string
): UseVisasResult {
  const [visas, setVisas] = useState<VisaWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
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
        const { visas: data, total: count } = await visaService.getVisas({
          search,
          country,
          category,
          page,
          pageSize
        });
        setVisas(data);
        setTotal(count);
      } catch (err: any) {
        console.error('Error fetching visas:', err);
        setError(errorHandler(err));
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
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await visaService.getVisa(id);
        setVisa(data);
      } catch (err: any) {
        console.error('Error fetching visa:', err);
        setError(errorHandler(err));
      } finally {
        setLoading(false);
      }
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
      try {
        const data = await visaService.getTrackerEntries(visaId);
        setEntries(data);
      } catch (err) {
        console.error('Error fetching tracker entries:', err);
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
      setLoading(true);
      try {
        const data = await visaService.getTrackerStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching tracker stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { stats, loading };
}
