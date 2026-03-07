import { useEffect, useState, useCallback, useRef } from 'react';
import { Newspaper, ArrowRight, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  category: string;
  published_at: string;
  
}

const PAGE_SIZE = 9;

export function News() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<'all' | 'policy' | 'processing' | 'regulation'>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Ref to track the latest filter to prevent race conditions
  const filterRef = useRef(filter);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  const fetchNews = useCallback(async (pageNumber: number) => {
    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('news_articles')
      .select('id, title, slug, excerpt, body, category, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(from, to);

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    const { data, error } = await query;

    // Check if filter changed while fetching
    if (filter !== filterRef.current) {
      return;
    }

    if (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    if (data) {
      if (pageNumber === 0) {
        if (data.length > 0) {
          setFeaturedNews(data[0]);
          setNews(data.slice(1));
        } else {
          setFeaturedNews(null);
          setNews([]);
        }
      } else {
        setNews((prev) => [...prev, ...data]);
      }

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }

    setLoading(false);
    setLoadingMore(false);
  }, [filter]);

  useEffect(() => {
    // Reset state when filter changes
    setPage(0);
    setHasMore(true);
    setNews([]);
    setFeaturedNews(null);
    setLoading(true);
    fetchNews(0);
  }, [fetchNews]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchNews(nextPage);
  };

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'policy', label: 'Policy Changes' },
    { value: 'processing', label: 'Processing Updates' },
    { value: 'regulation', label: 'Regulations' },
  ];

  const getExcerpt = (item: NewsItem) => {
    if (item.excerpt) return item.excerpt;
    if (item.body) {
      return item.body.substring(0, 150) + '...';
    }
    return '';
  };

  if (loading && page === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-3xl" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent dark:from-emerald-900/20 rounded-[4rem] blur-3xl"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 mb-6 text-white transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Newspaper className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 tracking-tight">Immigration News & Updates</h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest immigration policy updates, processing times, and regulatory changes affecting your visa journey.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value as typeof filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === cat.value
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md transform scale-105'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {featuredNews && (
          <div
            className="mb-16 group cursor-pointer relative"
            onClick={() => navigate(`/news/${featuredNews.slug}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/5 dark:to-blue-500/5 rounded-[2.5rem] transform group-hover:scale-[1.02] transition-transform duration-500 -z-10"></div>
            <div className="bg-white dark:bg-neutral-800 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500">
              <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-teal-500"></div>
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    {featuredNews.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 ml-auto">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredNews.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-6 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                  {featuredNews.title}
                </h2>
                <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 line-clamp-3 leading-relaxed">
                  {getExcerpt(featuredNews)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                      <Newspaper className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <span className="font-medium text-neutral-900 dark:text-white">VisaBuild Editorial</span>
                  </div>
                  <div className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-sm group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-colors">
                    Read Full Article
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {news.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer flex flex-col h-full bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate(`/news/${item.slug}`)}
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700/50 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
                  {getExcerpt(item)}
                </p>

                <div className="pt-5 border-t border-neutral-100 dark:border-neutral-700/50 mt-auto flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    Read Article
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                    <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && news.length > 0 && (
          <div className="flex justify-center mb-12">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="min-w-[200px]"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More News'
              )}
            </Button>
          </div>
        )}

        {news.length === 0 && !featuredNews && !loading && (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">Stay tuned for immigration news and updates</h3>
            <p className="text-neutral-500">We are working on bringing you the latest updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
