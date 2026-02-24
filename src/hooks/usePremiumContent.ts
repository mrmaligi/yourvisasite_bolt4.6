import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { premiumService } from '../lib/services/premium.service';
import { errorHandler } from '../lib/errors/handler';
import type { Visa, VisaPremiumContent } from '../types/database';
import type { ApiError } from '../lib/errors/api.error';

export interface UsePremiumContentResult {
  visa: Visa | null;
  content: VisaPremiumContent[];
  isPurchased: boolean;
  loading: boolean;
  error: ApiError | null;
  refresh: () => Promise<void>;
}

export function usePremiumContent(visaId: string | null) {
  const { user } = useAuth();
  const [visa, setVisa] = useState<Visa | null>(null);
  const [content, setContent] = useState<VisaPremiumContent[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    if (!visaId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Check purchase status first (or in parallel)
      const purchased = await premiumService.isPurchased(user?.id, visaId);
      setIsPurchased(purchased);

      const { content: contentData, visa: visaData } = await premiumService.getPremiumContent(visaId);
      setContent(contentData);
      setVisa(visaData);
    } catch (err: any) {
      console.error('Error fetching content:', err);
      setError(errorHandler(err));
    } finally {
      setLoading(false);
    }
  }, [visaId, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { visa, content, isPurchased, loading, error, refresh: fetchData };
}
