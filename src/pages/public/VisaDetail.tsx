import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink,
  Clock,
  CheckCircle,
  BookOpen,
  ArrowUpRight,
  ArrowLeft,
  AlertCircle,
  TrendingUp,
  Printer,
  ChevronRight,
  Shield,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VisaDetailSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { ShareButton } from '../../components/ShareButton';
import type { Visa, TrackerStats, VisaPremiumContent, Product, UserVisaPurchase, TrackerEntry, NewsArticle } from '../../types/database';

export function VisaDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [visa, setVisa] = useState<Visa | null>(null);
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [relatedVisas, setRelatedVisas] = useState<Visa[]>([]);
  const [premiumContent, setPremiumContent] = useState<VisaPremiumContent[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [purchase, setPurchase] = useState<UserVisaPurchase | null>(null);
  const [recentEntries, setRecentEntries] = useState<TrackerEntry[]>([]);
  const [visaNews, setVisaNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: visaData, error: visaError } = await supabase
        .from('visas')
        .select('*')
        .eq('id', id)
        .single();

      if (visaError) {
        console.error('Error fetching visa:', visaError);
        setLoading(false);
        return;
      }

      setVisa(visaData);

      const { data: statsData } = await supabase
        .from('tracker_stats')
        .select('*')
        .eq('visa_id', id)
        .maybeSingle();
      setStats(statsData);

      if (visaData) {
        const { data: relatedData } = await supabase
          .from('visas')
          .select('*')
          .eq('category', visaData.category)
          .neq('id', id)
          .limit(3);
        setRelatedVisas(relatedData || []);
      }

      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('visa_id', id)
        .maybeSingle();
      setProduct(productData);

      if (user) {
         const { data: purchaseData } = await supabase
            .from('user_visa_purchases')
            .select('*')
            .eq('user_id', user.id)
            .eq('visa_id', id)
            .maybeSingle();
         setPurchase(purchaseData);

         if (purchaseData) {
            const { data: contentData } = await supabase
              .from('visa_premium_content')
              .select('*')
              .eq('visa_id', id)
              .order('step_number');
            setPremiumContent(contentData || []);
         }
      }

      const { data: entriesData } = await supabase
        .from('tracker_entries')
        .select('*')
        .eq('visa_id', id)
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentEntries(entriesData || []);

      let newsQuery = supabase
        .from('news_articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (visaData?.category) {
        newsQuery = newsQuery.or(`visa_ids.cs.{${id}},category.eq.${visaData.category}`);
      } else {
        newsQuery = newsQuery.contains('visa_ids', [id]);
      }

      const { data: newsData } = await newsQuery;
      setVisaNews(newsData || []);

      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  if (loading) {
    return <VisaDetailSkeleton />;
  }

  if (!visa) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-heading font-bold text-navy-700 mb-2">Visa not found</h2>
        <Link to="/visas">
          <Button variant="secondary">Back to search</Button>
        </Link>
      </div>
    );
  }

  const hasPurchased = !!purchase;
  const price = product?.price_cents ? product.price_cents / 100 : 49;

  return (
    <div className="bg-neutral-50 min-h-screen pb-12">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link to="/" className="hover:text-navy-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/visas" className="hover:text-navy-600">Visas</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-navy-700 font-medium">{visa.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/visas" className="inline-flex items-center text-sm font-medium text-navy-600 hover:text-navy-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Search
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton title={`Check out this visa guide: ${visa.name}`} />
            <Button variant="secondary" size="sm" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="navy" className="text-sm px-3 py-1">Subclass {visa.subclass}</Badge>
            <Badge variant="default" className="text-sm px-3 py-1">{visa.category}</Badge>
            {hasPurchased && <Badge variant="success">Unlocked</Badge>}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy-700 mb-4">{visa.name}</h1>

          {/* Key Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-neutral-200 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Visa Cost</p>
              <p className="font-semibold text-navy-700">{visa.cost_aud || 'Varies'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Processing Time</p>
              <p className="font-semibold text-navy-700">{visa.processing_time_range || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Duration</p>
              <p className="font-semibold text-navy-700">{visa.duration || 'Permanent'}</p>
            </div>
            <div className="flex items-center">
              <a
                href={visa.official_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium border rounded transition-colors ${
                  visa.official_link 
                    ? 'bg-navy-50 text-navy-700 border-navy-200 hover:bg-navy-100' 
                    : 'text-neutral-400 bg-neutral-100 border-neutral-200 cursor-not-allowed'
                }`}
              >
                Official Site <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-xl font-heading font-bold text-navy-700 mb-4">Overview</h2>
              <div className="bg-white border border-neutral-200 p-6">
                <p className="text-neutral-700 leading-relaxed">{visa.summary || visa.description || "No summary available."}</p>
              </div>
            </section>

            {/* Info Alert */}
            <div className="bg-navy-50 border-l-4 border-navy-500 p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-navy-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy-700">Official Information</p>
                  <p className="text-sm text-navy-600 mt-1">
                    This information is sourced from the Australian Department of Home Affairs. 
                    Always verify current requirements on the official government website.
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {visa.key_requirements && (
              <section>
                <h2 className="text-xl font-heading font-bold text-navy-700 mb-4">Key Requirements</h2>
                <Card>
                  <CardBody className="pt-6">
                    <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-line">
                      {visa.key_requirements}
                    </div>
                  </CardBody>
                </Card>
              </section>
            )}

            {/* Premium Content */}
            <section id="premium-guide">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold text-navy-700">Application Guide</h2>
                {hasPurchased && <Badge variant="success">Unlocked</Badge>}
              </div>

              {hasPurchased && premiumContent.length > 0 ? (
                <div className="space-y-6">
                  {premiumContent.map((step) => (
                    <Card key={step.id} accent="left">
                      <CardHeader className="bg-navy-50 border-b border-navy-100">
                        <h3 className="font-semibold text-navy-700 flex items-center">
                          <span className="flex items-center justify-center w-6 h-6 bg-navy-600 text-white text-xs font-bold mr-3">
                            {step.step_number}
                          </span>
                          {step.title}
                        </h3>
                      </CardHeader>
                      <CardBody>
                        <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
                          {step.body}
                        </div>

                        {step.document_category && (
                          <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 text-sm">
                            <span className="font-medium text-neutral-700">Required Document: </span>
                            <Badge variant="info" className="ml-2">{step.document_category}</Badge>
                            {step.document_explanation && (
                              <p className="mt-2 text-neutral-600">{step.document_explanation}</p>
                            )}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card accent="gold" className="overflow-hidden">
                  <div className="bg-navy-700 p-8 text-center text-white">
                    <div className="w-16 h-16 bg-gold-500 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-2">Unlock the Premium Guide</h3>
                    <p className="text-navy-100 mb-8 max-w-md mx-auto">
                      Get step-by-step instructions, document checklists, and expert tips for a successful {visa.subclass} application.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8 text-left">
                      {[
                        'Step-by-step instructions',
                        'Document checklists',
                        'Example declarations',
                        'Expert tips & warnings'
                      ].map((feature, i) => (
                        <div key={i} className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0" />
                          <span className="text-sm text-navy-100">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {!user ? (
                      <Link to="/login">
                        <Button size="lg" variant="accent" className="w-full sm:w-auto">
                          Sign In to Unlock — ${price}
                        </Button>
                      </Link>
                    ) : (
                      <Button size="lg" variant="accent" className="w-full sm:w-auto">
                        Unlock Now — ${price}
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Processing Stats */}
            <Card>
              <CardHeader className="bg-navy-50">
                <h3 className="font-bold text-navy-700 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-navy-600" />
                  Real Processing Times
                </h3>
              </CardHeader>
              <CardBody>
                {stats ? (
                  <div className="space-y-6">
                    <div className="text-center py-4 border-b border-neutral-200">
                      <p className="text-4xl font-bold text-navy-700">
                        {Math.round(stats.median_days || 0)} days
                      </p>
                      <p className="text-sm text-neutral-500">Median processing time</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Fastest 25%</span>
                        <span className="font-semibold text-navy-700">{Math.round(stats.p25_days || 0)} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Slowest 25%</span>
                        <span className="font-semibold text-navy-700">{Math.round(stats.p75_days || 0)} days</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-200 text-center">
                      <p className="text-xs text-neutral-500">Based on {stats.total_entries} user reports</p>
                      <Link to="/tracker" className="text-sm text-navy-600 hover:text-navy-700 font-medium mt-2 inline-block">
                        View full stats →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500">No data yet</p>
                    <p className="text-sm text-neutral-400 mt-1">Be the first to submit a report</p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Related Visas */}
            {relatedVisas.length > 0 && (
              <Card>
                <CardHeader className="bg-navy-50">
                  <h3 className="font-bold text-navy-700">Related Visas</h3>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="divide-y divide-neutral-200">
                    {relatedVisas.map((v) => (
                      <Link key={v.id} to={`/visas/${v.id}`} className="block p-4 hover:bg-neutral-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="navy" className="mb-1">{v.subclass}</Badge>
                            <h4 className="font-medium text-navy-700">{v.name}</h4>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* News */}
            {visaNews.length > 0 && (
              <Card>
                <CardHeader className="bg-navy-50">
                  <h3 className="font-bold text-navy-700 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-navy-600" />
                    Latest News
                  </h3>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="divide-y divide-neutral-200">
                    {visaNews.map((article) => (
                      <Link
                        key={article.id}
                        to={`/news/${article.slug}`}
                        className="block p-4 hover:bg-neutral-50 transition-colors"
                      >
                        <h4 className="font-medium text-navy-700 line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-1">
                          {article.published_at
                            ? new Date(article.published_at).toLocaleDateString()
                            : new Date(article.created_at).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <Link to="/news" className="block p-4 text-center text-sm text-navy-600 hover:text-navy-700 font-medium border-t border-neutral-200">
                    View all news →
                  </Link>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
