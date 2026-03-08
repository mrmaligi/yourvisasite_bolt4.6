import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Newspaper, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  published_at: string;
}

const categories = [
  { id: 'all', label: 'All News' },
  { id: 'policy', label: 'Policy Changes' },
  { id: 'processing', label: 'Processing Times' },
  { id: 'regulation', label: 'Regulations' }
];

export function NewsV2() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNews();
  }, [filter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('news_articles')
        .select('id, title, slug, excerpt, category, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query.limit(12);

      if (error) throw error;
      setNews(data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Immigration News | VisaBuild</title>
        <meta name="description" content="Latest Australian immigration news, policy updates, and visa processing information." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-blue-400" />
              <Badge variant="primary" className="bg-blue-600">Latest Updates</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Immigration News</h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Stay informed about Australian visa policies, processing times, and regulatory changes.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter Tabs - SQUARE */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 text-sm font-medium border transition-colors ${
                  filter === cat.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* News Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200">
              <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No news articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="bg-white border border-slate-200 p-6 hover:border-blue-400 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.published_at)}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h2>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {item.excerpt || 'Read more...'}
                  </p>

                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && news.length >= 12 && (
            <div className="text-center mt-8">
              <Button variant="outline">Load More Articles</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
