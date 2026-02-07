import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { Visa } from '../../types/database';

interface PurchaseWithVisa {
  id: string;
  visa_id: string;
  purchased_at: string;
  visas: Visa;
}

export function MyVisas() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseWithVisa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_visa_purchases')
      .select('id, visa_id, purchased_at, visas(*)')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false })
      .then(({ data }) => {
        setPurchases((data || []) as unknown as PurchaseWithVisa[]);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">My Visas</h1>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : purchases.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No visa guides unlocked"
          description="Purchase a premium guide to get step-by-step instructions for your visa."
          action={{ label: 'Browse Visas', onClick: () => window.location.href = '/visas' }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {purchases.map((p) => (
            <Link key={p.id} to={`/visas/${p.visa_id}`}>
              <Card hover>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge>{p.visas.subclass_number}</Badge>
                    <Badge variant="premium">Premium</Badge>
                  </div>
                  <h3 className="font-semibold text-neutral-900">{p.visas.name}</h3>
                  <p className="text-sm text-neutral-500">{p.visas.country}</p>
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-100">
                    <span>Purchased {new Date(p.purchased_at).toLocaleDateString()}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
