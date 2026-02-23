import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Visa, VisaPremiumContent } from '../types/database';

export interface UsePremiumContentResult {
  visa: Visa | null;
  content: VisaPremiumContent[];
  isPurchased: boolean;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function usePremiumContent(visaId: string | null) {
  const { user } = useAuth();
  const [visa, setVisa] = useState<Visa | null>(null);
  const [content, setContent] = useState<VisaPremiumContent[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!visaId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data: visaData, error: visaError } = await supabase
        .from('visas')
        .select('*')
        .eq('id', visaId)
        .single();

      if (visaError) throw visaError;
      setVisa(visaData);

      // Premium content is now free for everyone
      setIsPurchased(true);

      const { data: steps, error: contentError } = await supabase
        .from('visa_premium_content')
        .select('*')
        .eq('visa_id', visaId)
        .order('section_number');

      if (contentError) throw contentError;
      setContent(steps || []);

    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [visaId, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { visa, content, isPurchased, loading, error, refresh: fetchData };
}
