import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Visa, VisaPremiumContent } from '../types/database';

interface UsePremiumContentResult {
  visa: Visa | null;
  content: VisaPremiumContent[];
  isPurchased: boolean;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function usePremiumContent(visaId: string | null): UsePremiumContentResult {
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

    // Don't start loading if no user yet (auth might be initializing)
    // But if we want to show loading while auth checks...
    // user can be null if not logged in.
    if (!user) {
      // If no user, we can't check purchase, so isPurchased = false.
      // We can still fetch visa details.
      setLoading(true);
    } else {
      setLoading(true);
    }

    try {
      setError(null);

      // 1. Fetch Visa Details
      const { data: visaData, error: visaError } = await supabase
        .from('visas')
        .select('*')
        .eq('id', visaId)
        .single();

      if (visaError) throw visaError;
      setVisa(visaData);

      let purchased = false;

      // 2. Check Purchase Status (only if user logged in)
      if (user) {
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('user_visa_purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('visa_id', visaId)
          .maybeSingle();

        if (purchaseError) throw purchaseError;
        purchased = !!purchaseData;
      }

      setIsPurchased(purchased);

      // 3. Fetch Premium Content (if purchased)
      if (purchased) {
        const { data: contentData, error: contentError } = await supabase
          .from('visa_premium_content')
          .select('*')
          .eq('visa_id', visaId)
          .order('step_number');

        if (contentError) throw contentError;
        setContent(contentData || []);
      } else {
        setContent([]);
      }

    } catch (err) {
      console.error('Error fetching premium content:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch content'));
    } finally {
      setLoading(false);
    }
  }, [visaId, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    visa,
    content,
    isPurchased,
    loading,
    error,
    refresh: fetchData
  };
}
