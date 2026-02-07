import { useEffect, useState } from 'react';
import { BookOpen, Download, Lock, CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/button';
import { EmptyState } from '../../components/ui/EmptyState';

interface PurchasedGuide {
  id: string;
  visa_id: string;
  visa_name: string;
  purchased_at: string;
  amount_cents: number;
  content_url: string | null;
}

interface AvailableGuide {
  id: string;
  name: string;
  description: string | null;
  premium_guide_url: string | null;
  country: string | null;
}

export function PremiumContent() {
  const { user } = useAuth();
  const [purchased, setPurchased] = useState<PurchasedGuide[]>([]);
  const [available, setAvailable] = useState<AvailableGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchContent();
  }, [user]);

  const fetchContent = async () => {
    if (!user) return;

    const { data: purchases } = await supabase
      .from('user_visa_purchases')
      .select('id, visa_id, purchased_at, amount_cents')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (purchases && purchases.length > 0) {
      const visaIds = purchases.map((p) => p.visa_id);
      const { data: visas } = await supabase
        .from('visas')
        .select('id, name, premium_guide_url')
        .in('id', visaIds);

      const visaMap = new Map(visas?.map((v) => [v.id, v]) || []);

      const enriched = purchases.map((p) => {
        const visa = visaMap.get(p.visa_id);
        return {
          id: p.id,
          visa_id: p.visa_id,
          visa_name: visa?.name || 'Unknown Visa',
          purchased_at: p.purchased_at,
          amount_cents: p.amount_cents,
          content_url: visa?.premium_guide_url || null,
        };
      });

      setPurchased(enriched);
    }

    const { data: allVisas } = await supabase
      .from('visas')
      .select('id, name, description, premium_guide_url, country')
      .not('premium_guide_url', 'is', null)
      .order('name');

    const purchasedIds = new Set(purchases?.map((p) => p.visa_id) || []);
    const availableGuides = (allVisas || []).filter((v) => !purchasedIds.has(v.id));

    setAvailable(availableGuides);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Premium Content</h1>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Premium Content</h1>
        <p className="text-neutral-500 mt-1">
          Access your purchased visa guides and explore new premium content.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">My Purchased Guides</h2>
        {purchased.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No purchased guides"
            description="Purchase premium visa guides from visa detail pages to access comprehensive application instructions."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {purchased.map((guide) => (
              <Card key={guide.id}>
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{guide.visa_name}</h3>
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Purchased {new Date(guide.purchased_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Owned</Badge>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    Comprehensive step-by-step guide with all requirements, forms, and timeline information.
                  </p>
                  {guide.content_url ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(guide.content_url!, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Guide
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" className="w-full" disabled>
                      Content Preparing
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {available.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Available Premium Guides</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {available.slice(0, 6).map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{guide.name}</h3>
                        {guide.country && (
                          <p className="text-xs text-neutral-500 mt-0.5">{guide.country}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="warning">$49</Badge>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                    {guide.description || 'Comprehensive visa application guide with detailed requirements.'}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => (window.location.href = `/visa/${guide.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
