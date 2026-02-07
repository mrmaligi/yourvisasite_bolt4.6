import { useEffect, useState } from 'react';
import { Newspaper, ArrowRight, Calendar, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  published_at: string;
  is_premium: boolean;
  author: string | null;
}

export function News() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'policy' | 'processing' | 'regulation'>('all');

  useEffect(() => {
    fetchNews();
  }, [filter]);

  const fetchNews = async () => {
    let query = supabase
      .from('news_articles')
      .select('id, title, summary, category, published_at, is_premium, author')
      .order('published_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    const { data } = await query;

    if (data && data.length > 0) {
      setFeaturedNews(data[0]);
      setNews(data.slice(1));
    }

    setLoading(false);
  };

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'policy', label: 'Policy Changes' },
    { value: 'processing', label: 'Processing Updates' },
    { value: 'regulation', label: 'Regulations' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-neutral-200 rounded-2xl" />
            <div className="grid md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 bg-neutral-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-6">
            <Newspaper className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Immigration News</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Stay informed with the latest immigration policy updates, processing times, and regulatory changes.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-12">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={filter === cat.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter(cat.value as typeof filter)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {featuredNews && (
          <Card
            className="mb-12 overflow-hidden hover:shadow-2xl transition-all cursor-pointer border-2 border-primary-100"
            onClick={() => navigate(`/news/${featuredNews.id}`)}
          >
            <CardBody className="p-0">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2" />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="primary" className="text-xs font-semibold">
                    Featured
                  </Badge>
                  <Badge variant="default" className="capitalize">
                    {featuredNews.category}
                  </Badge>
                  {featuredNews.is_premium && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Premium
                    </Badge>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">{featuredNews.title}</h2>
                <p className="text-lg text-neutral-600 mb-6 line-clamp-3">{featuredNews.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredNews.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    {featuredNews.author && <span>By {featuredNews.author}</span>}
                  </div>
                  <Button variant="secondary" size="sm">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {news.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-xl transition-all cursor-pointer"
              onClick={() => navigate(`/news/${item.id}`)}
            >
              <CardBody>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="capitalize text-xs">
                    {item.category}
                  </Badge>
                  {item.is_premium && (
                    <Badge variant="warning" className="flex items-center gap-1 text-xs">
                      <Lock className="w-3 h-3" />
                      Premium
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 line-clamp-3 mb-4">{item.summary}</p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.published_at).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-primary-600 flex items-center gap-1">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {news.length === 0 && !featuredNews && (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No articles found</h3>
            <p className="text-neutral-500">Check back later for immigration news and updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
