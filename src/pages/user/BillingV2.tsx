import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CreditCard, Download, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'succeeded' | 'pending' | 'failed';
  invoiceUrl?: string;
}

export function BillingV2() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [purchases, bookings] = await Promise.all([
          supabase
            .from('user_visa_purchases')
            .select('id, amount_paid_cents, purchased_at, visas(name)')
            .eq('user_id', user.id)
            .order('purchased_at', { ascending: false }),
          supabase
            .from('bookings')
            .select('id, amount_paid_cents, created_at, status')
            .eq('user_id', user.id)
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: false })
        ]);

        const purchaseTx: Transaction[] = (purchases.data || []).map((p: any) => ({
          id: p.id,
          description: `Premium Guide: ${p.visas?.name || 'Visa Guide'}`,
          amount: (p.amount_paid_cents || 0) / 100,
          date: p.purchased_at,
          status: 'succeeded',
          invoiceUrl: '#'
        }));

        const bookingTx: Transaction[] = (bookings.data || []).map((b: any) => ({
          id: b.id,
          description: 'Legal Consultation',
          amount: (b.amount_paid_cents || 0) / 100,
          date: b.created_at,
          status: 'succeeded',
          invoiceUrl: '#'
        }));

        setTransactions([...purchaseTx, ...bookingTx].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } catch (error) {
        console.error('Error fetching billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <Helmet>
        <title>Billing | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
                <p className="text-slate-600">Manage your payments and invoices</p>
              </div>
              
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">${totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-slate-600">Total Spent</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{transactions.length}</p>
                  <p className="text-sm text-slate-600">Transactions</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">Active</p>
                  <p className="text-sm text-slate-600">Account Status</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Transaction History</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-600">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No transactions yet</h3>
                <p className="text-slate-600">Your billing history will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                        {tx.status === 'succeeded' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : tx.status === 'pending' ? (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium text-slate-900">{tx.description}</p>
                        <p className="text-sm text-slate-600">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-slate-900">${tx.amount.toFixed(2)}</p>
                      
                      <Badge variant={tx.status === 'succeeded' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>
                        {tx.status}
                      </Badge>

                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
