import { useEffect, useState } from 'react';
import { ShoppingBag, Package, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

interface Purchase {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_type: 'service' | 'product';
  amount_cents: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  purchased_at: string;
  completed_at: string | null;
  lawyer_name: string | null;
  notes: string | null;
}

export function MarketplacePurchases() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    if (!user) return;

    const { data: purchasesData } = await supabase
      .from('marketplace_purchases')
      .select('id, listing_id, lawyer_id, amount_cents, status, purchased_at, completed_at, notes')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (purchasesData && purchasesData.length > 0) {
      const listingIds = [...new Set(purchasesData.map((p) => p.listing_id))];
      const lawyerIds = [...new Set(purchasesData.map((p) => p.lawyer_id))];

      const [listingsRes, lawyersRes] = await Promise.all([
        supabase
          .schema('lawyer')
          .from('marketplace_listings')
          .select('id, title, listing_type')
          .in('id', listingIds),
        supabase
          .schema('lawyer')
          .from('profiles')
          .select('id, user_id')
          .in('id', lawyerIds),
      ]);

      const listingMap = new Map(listingsRes.data?.map((l) => [l.id, l]) || []);

      if (lawyersRes.data) {
        const profileIds = lawyersRes.data.map((l) => l.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', profileIds);

        const profileMap = new Map(profilesData?.map((p) => [p.id, p.full_name]) || []);
        const lawyerProfileMap = new Map(
          lawyersRes.data.map((l) => [l.id, profileMap.get(l.user_id) || 'Unknown'])
        );

        const enriched = purchasesData.map((p) => {
          const listing = listingMap.get(p.listing_id);
          return {
            ...p,
            listing_title: listing?.title || 'Unknown Listing',
            listing_type: listing?.listing_type || 'service',
            lawyer_name: lawyerProfileMap.get(p.lawyer_id) || null,
          };
        });

        setPurchases(enriched);
      }
    }

    setLoading(false);
  };

  const statusConfig = {
    pending: { variant: 'warning' as const, icon: Clock, label: 'Pending' },
    completed: { variant: 'success' as const, icon: CheckCircle, label: 'Completed' },
    cancelled: { variant: 'default' as const, icon: XCircle, label: 'Cancelled' },
    refunded: { variant: 'default' as const, icon: XCircle, label: 'Refunded' },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Purchases</h1>
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
        <h1 className="text-2xl font-bold text-neutral-900">My Purchases</h1>
        <p className="text-neutral-500 mt-1">
          View and manage your purchased services and products from the marketplace.
        </p>
      </div>

      {purchases.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No purchases yet"
          description="Browse the marketplace to find services and products from immigration lawyers."
          action={{
            label: 'Browse Marketplace',
            onClick: () => (window.location.href = '/marketplace'),
          }}
        />
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => {
            const config = statusConfig[purchase.status];
            const Icon = config.icon;

            return (
              <Card key={purchase.id}>
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{purchase.listing_title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default" className="capitalize text-xs">
                            {purchase.listing_type}
                          </Badge>
                          <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-neutral-900">
                        ${(purchase.amount_cents / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <User className="w-4 h-4 text-neutral-400" />
                      <span>Lawyer: {purchase.lawyer_name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span>Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {purchase.completed_at && (
                    <div className="mt-2 text-sm text-neutral-600">
                      <span className="text-emerald-600 font-medium">Completed: </span>
                      {new Date(purchase.completed_at).toLocaleDateString()}
                    </div>
                  )}

                  {purchase.notes && (
                    <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                      <p className="text-xs font-medium text-neutral-700 mb-1">Notes:</p>
                      <p className="text-sm text-neutral-600">{purchase.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
