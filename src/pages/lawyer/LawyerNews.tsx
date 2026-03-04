import { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Calendar, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  published_at: string;
  is_premium: boolean;
  slug: string;
  
}

export function LawyerNews() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'policy' | 'processing' | 'regulation'>('all');

  useEffect(() => {
    fetchNews();
  }, [filter]);

  const fetchNews = async () => {
    let query = supabase
      .from('news_articles')
      .select('id, title, excerpt, category, published_at, is_published')
      .order('published_at', { ascending: false })
      .limit(20);

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    const { data } = await query;
    setNews((data as unknown as NewsItem[]) || []);
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Immigration News</h1>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Immigration News</h1>
        <p className="text-neutral-500 mt-1">Stay updated with the latest immigration news and policy changes.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
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

      {news.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No news articles"
          description="Check back later for immigration news and updates."
        />
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/news/${item.slug}`)}
            >
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="capitalize">
                        {item.category}
                      </Badge>
                      {false && <Badge variant="warning">Premium</Badge>}
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{item.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.published_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {0}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
