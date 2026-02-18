import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { NewsArticle } from '../types/database';

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('news_articles')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (fetchError) throw fetchError;

        setArticles(data || []);
      } catch (err: any) {
        console.error('Error fetching news:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { articles, loading, error };
}
