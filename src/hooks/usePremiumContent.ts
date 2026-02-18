import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { VisaPremiumContent } from '../types/database';

export function usePremiumContent(visaId: string | undefined) {
  const { user } = useAuth();
  const [sections, setSections] = useState<VisaPremiumContent[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!visaId) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Check purchase status if logged in
        let purchased = false;
        if (user) {
          const { data: purchaseData, error: purchaseError } = await supabase
            .from('user_visa_purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('visa_id', visaId)
            .maybeSingle();

          if (purchaseError) {
             console.error('Error checking purchase:', purchaseError);
             // Don't throw, just assume not purchased
          }
          purchased = !!purchaseData;
        }
        setIsPurchased(purchased);

        // 2. Fetch content
        // Note: Row Level Security (RLS) should ideally prevent fetching the body if not purchased,
        // but here we might just fetch what we can.
        // If the API returns partial data or we handle it here.
        // The prompt implies we fetch "sections".

        const { data, error: contentError } = await supabase
          .from('visa_premium_content')
          .select('*')
          .eq('visa_id', visaId)
          .order('step_number');

        if (contentError) throw contentError;
        setSections(data || []);

      } catch (err: any) {
        console.error('Error fetching premium content:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [visaId, user]);

  return { sections, isPurchased, loading, error };
}
