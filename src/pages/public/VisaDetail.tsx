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
} from 'lucide-react';
import { useVisa } from '../../hooks/useVisas';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { TRACKER_THRESHOLDS } from '../../lib/constants';
import type { VisaPremiumContent, Product, UserVisaPurchase } from '../../types/database';

export function VisaDetail() {
  const { id } = useParams<{ id: string }>();
  const { visa, loading } = useVisa(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const [premiumContent, setPremiumContent] = useState<VisaPremiumContent[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [purchase, setPurchase] = useState<UserVisaPurchase | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

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

  const handlePurchase = async () => {
    if (!user || !id || !product) return;
    setPurchaseLoading(true);

    try {
      const { error } = await supabase
        .from('user_visa_purchases')
        .insert({
          user_id: user.id,
          visa_id: id,
          amount_cents: product.price_cents,
          payment_provider: 'demo',
          payment_id: `demo_${Date.now()}`,
        });

      if (error) throw error;

      toast('success', 'Guide unlocked! You now have full access.');
      setShowPaywall(false);

      const { data: p } = await supabase
        .from('user_visa_purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('visa_id', id)
        .maybeSingle();
      setPurchase(p);

      const { data: content } = await supabase
        .from('visa_premium_content')
        .select('*')
        .eq('visa_id', id)
        .order('step_number');
      setPremiumContent(content || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast('error', message);
    } finally {
      setPurchaseLoading(false);
    }
  };

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

      {stats && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              Processing Statistics
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { label: 'Weighted Avg', value: `${Math.round(stats.weighted_avg_days ?? 0)}d`, icon: Clock },
                { label: 'EWMA Trend', value: `${Math.round(stats.ewma_days || 0)}d`, icon: TrendingUp },
                { label: 'Median', value: `${Math.round(stats.median_days || 0)}d`, icon: BarChart3 },
                { label: 'P25-P75', value: `${Math.round(stats.p25_days || 0)}-${Math.round(stats.p75_days || 0)}d`, icon: BarChart3 },
                { label: 'Reports', value: stats.total_entries.toString(), icon: CheckCircle },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs text-neutral-400 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
                </div>
              ))}
            </div>
            {stats.weighted_avg_days && (
              <div className="mt-5 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2">
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
                <p className="text-xs text-neutral-400 mt-2">
                  Last updated {new Date(stats.last_updated).toLocaleString()}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {hasPurchased && premiumContent.length > 0 ? (
        <Card className="mb-6">
          <CardHeader className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-600" />
            <h2 className="text-lg font-semibold text-neutral-900">Step-by-Step Guide</h2>
            <Badge variant="premium">Premium</Badge>
          </CardHeader>
          <CardBody className="space-y-6">
            {premiumContent.map((step) => (
              <div key={step.id} className="relative pl-8 pb-6 border-l-2 border-primary-200 last:border-0 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary-500 border-2 border-white" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-900">
                    Step {step.step_number}: {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">{step.body}</p>
                  {step.document_category && (
                    <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                      <p className="text-xs font-medium text-neutral-500 mb-1">Required Document</p>
                      <p className="text-sm font-medium text-neutral-800">{step.document_category}</p>
                      {step.document_explanation && (
                        <p className="text-xs text-neutral-500 mt-1">{step.document_explanation}</p>
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
            <Button
              size="lg"
              onClick={() => user ? setShowPaywall(true) : toast('info', 'Please sign in first')}
              className="bg-accent-500 hover:bg-accent-600 text-white"
            >
              Unlock for ${(price / 100).toFixed(0)}
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="Confirm Purchase"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPaywall(false)}>Cancel</Button>
            <Button loading={purchaseLoading} onClick={handlePurchase}>
              Pay ${(price / 100).toFixed(0)}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-neutral-700">
            You are about to unlock the premium guide for <strong>{visa.name}</strong>.
          </p>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Guide: {visa.subclass_number} - {visa.name}</span>
              <span className="font-semibold text-neutral-900">${(price / 100).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
