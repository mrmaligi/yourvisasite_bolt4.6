import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink,
  Clock,
  TrendingUp,
  BarChart3,
  Lock,
  CheckCircle,
  BookOpen,
  FileText,
  ListChecks,
  AlertCircle
} from 'lucide-react';
import { useVisa, useVisaTrackerEntries } from '../../hooks/useVisas';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { ProcessingTrendChart } from '../../components/ui/ProcessingTrendChart';
import { StripeCheckout } from '../../components/StripeCheckout';
import { STRIPE_PRODUCTS } from '../../stripe-config';
import { TRACKER_THRESHOLDS } from '../../lib/constants';
import type { VisaPremiumContent, Product, UserVisaPurchase } from '../../types/database';

export function VisaDetail() {
  const { id } = useParams<{ id: string }>();
  const { visa, loading } = useVisa(id);
  const { entries: trackerEntries, loading: entriesLoading } = useVisaTrackerEntries(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const [premiumContent, setPremiumContent] = useState<VisaPremiumContent[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [purchase, setPurchase] = useState<UserVisaPurchase | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    supabase
      .from('products')
      .select('*')
      .eq('visa_id', id)
      .maybeSingle()
      .then(({ data }) => setProduct(data));

    if (user) {
      supabase
        .from('user_visa_purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('visa_id', id)
        .maybeSingle()
        .then(({ data }) => setPurchase(data));

      supabase
        .from('visa_premium_content')
        .select('*')
        .eq('visa_id', id)
        .order('step_number')
        .then(({ data }) => setPremiumContent(data || []));
    }
  }, [id, user]);

  // Stripe checkout success handler - checks for completed session
  useEffect(() => {
    const checkSession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId && user && id) {
        setPurchaseLoading(true);
        try {
          // Verify the purchase was recorded
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
            // Clear the session_id from URL
            window.history.replaceState({}, '', window.location.pathname);
          }
        } catch (err) {
          console.error('Session check error:', err);
        } finally {
          setPurchaseLoading(false);
        }
      }
    };
    
    checkSession();
  }, [user, id, toast]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!visa) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Visa not found</h2>
        <Link to="/visas" className="text-primary-600 hover:underline">Back to search</Link>
      </div>
    );
  }

  const stats = visa.tracker_stats;
  const reqs = visa.visa_requirements?.requirements_json as any;
  const price = product?.price_cents || 4900;
  const hasPurchased = !!purchase;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/visas" className="text-sm text-primary-600 hover:underline mb-6 inline-block">
        Back to Visa Search
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge>{visa.subclass_number}</Badge>
          <Badge variant="primary">{visa.category}</Badge>
          <Badge variant="info">{visa.country}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-3">{visa.name}</h1>
        {visa.official_url && (
          <a
            href={visa.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:underline"
          >
            Official government page <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {visa.summary && (
        <Card className="mb-6">
          <CardBody>
            <p className="text-neutral-700 leading-relaxed">{visa.summary}</p>
            {visa.processing_fee_description && (
              <p className="text-sm text-neutral-500 mt-3">Fees: {visa.processing_fee_description}</p>
            )}
          </CardBody>
        </Card>
      )}

      {/* Structured Requirements from JSON */}
      {reqs && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {reqs.eligibility && (
            <Card className="h-full">
              <CardHeader className="flex items-center gap-2 pb-2">
                <ListChecks className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-neutral-900">Eligibility Criteria</h2>
              </CardHeader>
              <CardBody className="pt-0">
                <ul className="space-y-2 mt-2">
                  {reqs.eligibility.map((item: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-neutral-700">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {reqs.documents && (
            <Card className="h-full">
              <CardBody>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-neutral-900">Required Documents</h2>
                </div>
                <div className="space-y-6">
                  {Object.entries(reqs.documents).map(([category, docs]: [string, any]) => (
                    <div key={category}>
                      <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 pb-1 border-b border-neutral-100">
                        {category.replace(/_/g, ' ')}
                      </h3>
                      <ul className="space-y-2">
                        {Array.isArray(docs) ? docs.map((doc: string, i: number) => (
                          <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                            <span className="text-primary-400 mt-1.5">•</span>
                            <span className="leading-relaxed">{doc}</span>
                          </li>
                        )) : (
                          <li className="text-sm text-neutral-700 flex items-start gap-2">
                            <span className="text-primary-400 mt-1.5">•</span>
                            <span className="leading-relaxed">{String(docs)}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* Processing Times Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {stats && (
          <div className="h-full flex flex-col gap-6">
            <Card className="flex-1">
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-600" />
                  Community Tracker
                </h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">Avg Wait</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {stats.weighted_avg_days ? `${Math.round(stats.weighted_avg_days)}d` : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">Reports</p>
                    <p className="text-2xl font-bold text-neutral-900">{stats.total_entries}</p>
                  </div>
                </div>
                
                {stats.weighted_avg_days && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-neutral-500">Speed rating:</span>
                      <Badge
                        variant={
                          stats.weighted_avg_days <= TRACKER_THRESHOLDS.FAST_MAX_DAYS
                            ? 'success'
                            : stats.weighted_avg_days <= TRACKER_THRESHOLDS.MODERATE_MAX_DAYS
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {stats.weighted_avg_days <= TRACKER_THRESHOLDS.FAST_MAX_DAYS
                          ? 'Fast'
                          : stats.weighted_avg_days <= TRACKER_THRESHOLDS.MODERATE_MAX_DAYS
                          ? 'Moderate'
                          : 'Slow'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
            
            {!entriesLoading && trackerEntries.length > 0 && (
              <ProcessingTrendChart entries={trackerEntries} visaName={visa.subclass_number} />
            )}
          </div>
        )}

        {reqs?.processing_times && (
          <Card className="h-full bg-neutral-50 border-neutral-200">
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-neutral-600" />
                Official Estimates
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-neutral-700 leading-relaxed mb-4">
                {reqs.processing_times.summary}
              </p>
              <div className="flex flex-col gap-1 text-xs text-neutral-500">
                 {reqs.processing_times.source && (
                  <a 
                    href={reqs.processing_times.source}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline text-primary-600 flex items-center gap-1"
                  >
                    Source: Home Affairs <ExternalLink className="w-3 h-3" />
                  </a>
                 )}
                 {reqs.processing_times.last_checked && (
                   <span>Last checked: {reqs.processing_times.last_checked}</span>
                 )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {hasPurchased && premiumContent.length > 0 ? (
        <Card className="mb-6">
          <CardHeader className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-600" />
            <h2 className="text-lg font-semibold text-neutral-900">Step-by-Step Guide</h2>
            <Badge variant="premium">Premium</Badge>
          </CardHeader>
          <CardBody className="space-y-6">
            {premiumContent.map((step) => (
              <div key={step.id} className="relative pl-8 pb-8 border-l-2 border-primary-100 last:border-0 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary-600 border-4 border-white shadow-sm" />
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-neutral-900">
                    <span className="text-primary-600 mr-2">Step {step.step_number}</span>
                    {step.title}
                  </h3>
                  <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap text-sm">{step.body}</div>
                  
                  {step.document_category && (
                    <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary-600" />
                        <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">Required Evidence</span>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 mb-1">{step.document_category}</p>
                      {step.document_explanation && (
                        <p className="text-sm text-neutral-600 italic">"{step.document_explanation}"</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      ) : (
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-8 text-center">
            <div className="w-14 h-14 bg-accent-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-accent-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Unlock the Full Guide</h2>
            <p className="text-neutral-300 mb-6 max-w-md mx-auto">
              Get step-by-step instructions, document checklists, and expert tips for this visa application.
            </p>
            <ul className="text-sm text-neutral-300 space-y-2 mb-8 max-w-xs mx-auto text-left">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-400" /> Complete step-by-step guide</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-400" /> Document upload helper</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-400" /> Example documents and tips</li>
            </ul>
            {user ? (
              <StripeCheckout 
                product={STRIPE_PRODUCTS.visasite}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Unlock Guide — {STRIPE_PRODUCTS.visasite.currencySymbol}{STRIPE_PRODUCTS.visasite.price}
              </StripeCheckout>
            ) : (
              <Button
                size="lg"
                onClick={() => toast('info', 'Please sign in first')}
                className="bg-accent-500 hover:bg-accent-600 text-white"
              >
                Unlock Guide — {STRIPE_PRODUCTS.visasite.currencySymbol}{STRIPE_PRODUCTS.visasite.price}
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
