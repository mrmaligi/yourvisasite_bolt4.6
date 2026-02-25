import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { FadeIn } from '../../components/animations/FadeIn';
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

    const fetchPurchases = async () => {
      try {
        const { data, error } = await supabase
          .from('user_visa_purchases')
          .select('id, visa_id, purchased_at, visas(*)')
          .eq('user_id', user.id)
          .order('purchased_at', { ascending: false });

        if (error) throw error;
        setPurchases((data || []) as unknown as PurchaseWithVisa[]);
      } catch (err) {
        console.error('Error fetching purchased visas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Premium Visas</h1>
          <p className="text-neutral-500 mt-1">Access your purchased step-by-step guides.</p>
        </div>
        <Link to="/visas">
          <Button variant="secondary" size="sm">Browse More</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : purchases.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No premium guides purchased yet"
          description="Browse our visa catalog to unlock comprehensive step-by-step guides."
          action={{ label: 'Browse Visas', onClick: () => window.location.href = '/visas' }}
        />
      ) : (
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((p) => (
              <Card key={p.id} hover className="flex flex-col h-full">
                <CardBody className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Badge variant="premium">Premium Guide</Badge>
                    <h3 className="text-lg font-bold text-neutral-900 line-clamp-1" title={p.visas.name}>
                      {p.visas.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Subclass</span>
                    <span className="font-medium text-neutral-900">{p.visas.subclass}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Category</span>
                    <span className="font-medium text-neutral-900 capitalize">{p.visas.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Purchased</span>
                    <span className="font-medium text-neutral-900">
                      {new Date(p.purchased_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardBody>

              <CardFooter className="bg-neutral-50 border-t border-neutral-100 p-4">
                <Link to={`/dashboard/premium?visa_id=${p.visa_id}`} className="w-full">
                  <Button className="w-full group">
                    View Guide
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
