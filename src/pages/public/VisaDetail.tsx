import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink,
  Clock,
  CheckCircle,
  BookOpen,
  ArrowUpRight,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { StripeCheckout } from '../../components/StripeCheckout';
import { FavoriteButton } from '../../components/FavoriteButton';
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
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      // 1. Fetch Visa
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

      // 2. Fetch Stats
      const { data: statsData } = await supabase
        .from('tracker_stats')
        .select('*')
        .eq('visa_id', id)
        .maybeSingle();
      setStats(statsData);

      // 3. Fetch Related Visas
      if (visaData) {
        const { data: relatedData } = await supabase
          .from('visas')
          .select('*')
          .eq('category', visaData.category)
          .neq('id', id)
          .limit(3);
        setRelatedVisas(relatedData || []);
      }

      // 4. Fetch Product info
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('visa_id', id)
        .maybeSingle();
      setProduct(productData);

      // 5. Fetch Purchase & Premium Content & Saved Status (if user logged in)
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

         // Check saved status
         const { data: savedData } = await supabase
            .from('saved_visas')
            .select('id')
            .eq('user_id', user.id)
            .eq('visa_id', id)
            .maybeSingle();
         setIsSaved(!!savedData);
      }

      // 6. Fetch Recent Entries
      const { data: entriesData } = await supabase
        .from('tracker_entries')
        .select('*')
        .eq('visa_id', id)
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentEntries(entriesData || []);

      // 7. Fetch Visa-Specific News
      const { data: newsData } = await supabase
        .from('news_articles')
        .select('*')
        .contains('visa_ids', [id])
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      setVisaNews(newsData || []);

      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  // Stripe success handler
  useEffect(() => {
    const checkSession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId && user && id) {
        try {
          const { data: p } = await supabase
            .from('user_visa_purchases')
            .select('*')
            .eq('user_id', user.id)
            .eq('visa_id', id)
            .maybeSingle();
          
          if (p) {
            setPurchase(p);
            const { data: content } = await supabase
              .from('visa_premium_content')
              .select('*')
              .eq('visa_id', id)
              .order('step_number');
            setPremiumContent(content || []);
            toast('success', 'Payment successful! Guide unlocked.');
            window.history.replaceState({}, '', window.location.pathname);
          }
        } catch (err) {
          console.error('Session check error:', err);
        }
      }
    };
    checkSession();
  }, [user, id, toast]);

  const handleToggleSaved = async () => {
    if (!user || !visa) return;

    if (isSaved) {
      const { error } = await supabase
        .from('saved_visas')
        .delete()
        .eq('user_id', user.id)
        .eq('visa_id', visa.id);

      if (!error) setIsSaved(false);
    } else {
      const { error } = await supabase
        .from('saved_visas')
        .insert({ user_id: user.id, visa_id: visa.id });

      if (!error) setIsSaved(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-3/4" />
        <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!visa) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Visa not found</h2>
        <Link to="/visas">
            <Button variant="secondary">Back to search</Button>
        </Link>
      </div>
    );
  }

  const hasPurchased = !!purchase;
  const price = product?.price_cents ? product.price_cents / 100 : 49;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/visas" className="hover:text-primary-600">Visas</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-medium truncate">{visa.name}</span>
      </div>

      <Link to="/visas" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Search
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap items-center gap-3">
                <Badge className="text-sm px-3 py-1">{visa.subclass}</Badge>
                <Badge variant="primary" className="text-sm px-3 py-1">{visa.category}</Badge>
            </div>
            <FavoriteButton
                isSaved={isSaved}
                onToggle={handleToggleSaved}
                size="lg"
            />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">{visa.name}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div>
                <p className="text-sm text-neutral-500 mb-1">Cost</p>
                <p className="font-semibold text-neutral-900">{visa.cost_aud || 'Varies'}</p>
            </div>
            <div>
                <p className="text-sm text-neutral-500 mb-1">Processing Time</p>
                <p className="font-semibold text-neutral-900">{visa.processing_time_range || 'Unknown'}</p>
            </div>
            <div>
                <p className="text-sm text-neutral-500 mb-1">Duration</p>
                <p className="font-semibold text-neutral-900">{visa.duration || 'Permanent'}</p>
            </div>
            <div>
                 <a
                    href={visa.official_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center w-full h-full text-sm font-medium rounded-lg transition-colors ${visa.official_link ? 'text-primary-600 bg-white border border-primary-200 hover:bg-primary-50' : 'text-neutral-400 bg-neutral-100 cursor-not-allowed'}`}
                 >
                    Official Site <ExternalLink className="w-4 h-4 ml-2" />
                 </a>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Summary */}
            <section>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Overview</h2>
                <div className="prose prose-neutral max-w-none text-neutral-600">
                    <p>{visa.summary || visa.description || "No summary available."}</p>
                </div>
            </section>

            {/* Requirements */}
            {visa.key_requirements && (
                <section>
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Key Requirements</h2>
                    <Card>
                        <CardBody className="pt-6">
                            <div className="prose prose-sm max-w-none text-neutral-600 whitespace-pre-line">
                                {visa.key_requirements}
                            </div>
                        </CardBody>
                    </Card>
                </section>
            )}

            {/* Premium Content */}
            <section id="premium-guide">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-neutral-900">Application Guide</h2>
                    {hasPurchased && <Badge variant="success">Unlocked</Badge>}
                 </div>

                 {hasPurchased && premiumContent.length > 0 ? (
                    <div className="space-y-6">
                        {premiumContent.map((step) => (
                            <Card key={step.id} className="overflow-hidden">
                                <CardHeader className="bg-primary-50/50 border-b border-primary-100">
                                    <h3 className="font-semibold text-primary-900 flex items-center">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold mr-3">
                                            {step.step_number}
                                        </span>
                                        {step.title}
                                    </h3>
                                </CardHeader>
                                <CardBody>
                                    <div className="prose prose-sm max-w-none text-neutral-600 whitespace-pre-wrap">
                                        {step.body}
                                    </div>

                                    {step.document_category && (
                                        <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-sm">
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
                    <Card className="overflow-hidden border-primary-200 shadow-sm">
                        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-8 text-center text-white">
                            <BookOpen className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Unlock the Premium Guide</h3>
                            <p className="text-neutral-300 mb-8 max-w-md mx-auto">
                                Get step-by-step instructions, document checklists, and expert tips for a successful {visa.subclass} application.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8 text-left">
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                    <span className="text-sm text-neutral-200">Step-by-step instructions</span>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                    <span className="text-sm text-neutral-200">Document checklists</span>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                    <span className="text-sm text-neutral-200">Example declarations</span>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                    <span className="text-sm text-neutral-200">Expert tips & warnings</span>
                                </div>
                            </div>

                            {user ? (
                                <StripeCheckout
                                    type="premium"
                                    visaId={visa.id}
                                    amount={product?.price_cents || 4900}
                                    className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-primary-900/20"
                                >
                                    Unlock Now — ${price}
                                </StripeCheckout>
                            ) : (
                                <Button
                                    onClick={() => toast('info', 'Please log in to purchase')}
                                    className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-primary-900/20"
                                >
                                    Unlock Now — ${price}
                                </Button>
                            )}
                        </div>
                    </Card>
                 )}
            </section>
        </div>

        <div className="space-y-8">
            {/* Processing Stats */}
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-600" />
                        Real Processing Times
                    </h3>
                </CardHeader>
                <CardBody>
                    {stats ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-neutral-900">
                                    {Math.round(stats.median_days || 0)} days
                                </p>
                                <p className="text-sm text-neutral-500">Median waiting time</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-neutral-100">
                                <div className="relative pt-6 pb-2">
                                    {/* Visual Distribution Bar */}
                                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                                        <div className="w-1/4 bg-primary-200" />
                                        <div className="w-2/4 bg-primary-400" />
                                        <div className="w-1/4 bg-primary-600" />
                                    </div>

                                    {/* Markers */}
                                    <div className="absolute top-0 left-[25%] -translate-x-1/2 flex flex-col items-center">
                                        <span className="text-xs font-medium text-neutral-700">{Math.round(stats.p25_days || 0)}d</span>
                                        <div className="h-2 w-px bg-neutral-300 mt-1" />
                                    </div>
                                    <div className="absolute top-0 left-[50%] -translate-x-1/2 flex flex-col items-center">
                                        <span className="text-xs font-bold text-primary-700">{Math.round(stats.median_days || 0)}d</span>
                                        <div className="h-2 w-px bg-primary-500 mt-1" />
                                    </div>
                                    <div className="absolute top-0 left-[75%] -translate-x-1/2 flex flex-col items-center">
                                        <span className="text-xs font-medium text-neutral-700">{Math.round(stats.p75_days || 0)}d</span>
                                        <div className="h-2 w-px bg-neutral-300 mt-1" />
                                    </div>

                                    <div className="flex justify-between text-xs text-neutral-400 mt-2">
                                        <span>Fast (25%)</span>
                                        <span>Slow (75%)</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                     <p className="text-xs text-neutral-400 mt-2">Based on {stats.total_entries} user reports</p>
                                     <Link to="/tracker" className="text-xs text-primary-600 hover:underline">View full tracker stats</Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                            <p className="text-neutral-500 text-sm">No sufficient data yet.</p>
                            <Link to="/tracker" className="text-xs text-primary-600 hover:underline mt-2 block">
                                Check global stats
                            </Link>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Recent Reports */}
            {recentEntries.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    Recent Reports
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {recentEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900 capitalize">{entry.outcome}</span>
                            {entry.submitter_role === 'lawyer' && (
                              <Badge variant="primary" className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified Lawyer
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 mt-0.5">
                            {entry.processing_days} days processing
                          </p>
                        </div>
                        <span className="text-xs text-neutral-400">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Visa-Specific News */}
            {visaNews.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    Latest News
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {visaNews.map((article) => (
                      <Link
                        key={article.id}
                        to={`/news/${article.slug}`}
                        className="block group"
                      >
                        <div className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                          <h4 className="font-medium text-neutral-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-1">
                            {article.published_at
                              ? new Date(article.published_at).toLocaleDateString()
                              : new Date(article.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/news"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mt-4"
                  >
                    View all news
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardBody>
              </Card>
            )}

            {/* Related Visas */}
            {relatedVisas.length > 0 && (
                <div>
                    <h3 className="font-bold text-neutral-900 mb-4">Related Visas</h3>
                    <div className="space-y-3">
                        {relatedVisas.map((v) => (
                            <Link key={v.id} to={`/visas/${v.id}`}>
                                <Card hover className="group">
                                    <CardBody className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Badge className="mb-2">{v.subclass}</Badge>
                                                <h4 className="font-medium text-neutral-900 group-hover:text-primary-700 transition-colors">
                                                    {v.name}
                                                </h4>
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-600" />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
