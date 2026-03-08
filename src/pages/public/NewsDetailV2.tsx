import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { NewsArticle } from '../../types/database';

interface ArticleWithAuthor extends NewsArticle {
  author_name: string | null;
}

export function NewsDetailV2() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleWithAuthor | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Pick<NewsArticle, 'id' | 'title' | 'slug' | 'published_at' | 'category'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchArticleAndRelated();
  }, [slug]);

  const fetchArticleAndRelated = async () => {
    setLoading(true);
    
    // Fetch article
    const { data: articleRow } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (!articleRow) {
      setArticle(null);
      setLoading(false);
      return;
    }

    // Fetch author
    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', articleRow.author_id)
      .maybeSingle();

    setArticle({
      ...articleRow,
      author_name: authorProfile?.full_name || null,
    });

    // Fetch related articles
    const { data: related } = await supabase
      .from('news_articles')
      .select('id, title, slug, published_at, category')
      .eq('is_published', true)
      .neq('id', articleRow.id)
      .eq('category', articleRow.category)
      .order('published_at', { ascending: false })
      .limit(3);

    setRelatedArticles(related || []);
    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h1>
          <p className="text-slate-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link to="/news">
            <Button variant="primary">Back to News</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | VisaBuild News</title>
        <meta name="description" content={article.excerpt || article.title} />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/news" className="inline-flex items-center text-slate-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
            
            <Badge variant="primary" className="mb-4 bg-blue-600">{article.category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {article.author_name || 'VisaBuild Team'}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - SQUARE */}
            <div className="lg:col-span-2">
              {article.featured_image && (
                <div className="mb-6">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="bg-white border border-slate-200 p-6">
                <div 
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </div>

            {/* Sidebar - SQUARE */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Share</h3>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
              </div>

              {relatedArticles.length > 0 && (
                <div className="bg-white border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Related Articles</h3>
                  
                  <div className="space-y-3">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        to={`/news/${related.slug}`}
                        className="block p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="font-medium text-slate-900 text-sm mb-1">{related.title}</div>
                        <div className="text-xs text-slate-500">{formatDate(related.published_at)}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
