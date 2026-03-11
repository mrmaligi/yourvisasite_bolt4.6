import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { Visa } from '../../types/database';

interface PurchaseWithVisa {
  id: string;
  visa_id: string;
  purchased_at: string;
  visas: Visa;
}

export function MyVisasV2() {
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
    <>
      <Helmet>
        <title>My Premium Visas | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Premium Visas</h1>
                <p className="text-slate-600">Access your purchased step-by-step guides</p>
              </div>
              <Link to="/visas">
                <Button variant="outline">Browse More</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12 text-slate-600">Loading your visas...</div>
          ) : purchases.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No premium guides yet</h3>
              <p className="text-slate-600 mb-6">Purchase a premium guide to get step-by-step instructions.</p>
              <Link to="/visas">
                <Button variant="primary">Browse Visas</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white border border-slate-200 p-6 hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="primary">Premium</Badge>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{purchase.visas.name}</h3>
                  
                  <p className="text-sm text-slate-600 mb-4">
                    Purchased on {new Date(purchase.purchased_at).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2">
                    <Link to={`/visas/${(purchase.visas as {slug?: string}).slug}`} className="flex-1">
                      <Button variant="primary" className="w-full">
                        View Guide
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    
                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
