import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CreditCard, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
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

export function Billing() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch real data from purchases and bookings
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
          invoiceUrl: '#' // Placeholder
        }));

        const bookingTx: Transaction[] = (bookings.data || []).map((b: any) => ({
          id: b.id,
          description: 'Legal Consultation',
          amount: (b.amount_paid_cents || 0) / 100,
          date: b.created_at,
          status: 'succeeded',
          invoiceUrl: '#'
        }));

        const allTx = [...purchaseTx, ...bookingTx].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(allTx);
      } catch (err) {
        console.error('Error fetching billing:', err);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Billing & Payments | VisaBuild</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Billing & Payments</h1>
        <p className="text-neutral-500 mt-1">Manage your payment methods and view transaction history.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Payment Methods</h2>
              <Button variant="secondary" size="sm">Add Method</Button>
            </CardHeader>
            <CardBody>
              <div className="flex items-center p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
                <div className="w-12 h-8 bg-neutral-100 rounded flex items-center justify-center mr-4">
                  <CreditCard className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white">Visa ending in 4242</p>
                  <p className="text-xs text-neutral-500">Expires 12/24</p>
                </div>
                <Badge variant="success">Default</Badge>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Transaction History</h2>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500">
                    No transactions found.
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          tx.status === 'succeeded' ? 'bg-green-100 text-green-600' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {tx.status === 'succeeded' ? <CheckCircle className="w-4 h-4" /> :
                           tx.status === 'pending' ? <Clock className="w-4 h-4" /> :
                           <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{tx.description}</p>
                          <p className="text-xs text-neutral-500">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          ${tx.amount.toFixed(2)}
                        </span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="w-4 h-4 text-neutral-400" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card className="bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/30">
            <CardBody>
              <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">Billing Support</h3>
              <p className="text-sm text-primary-800 dark:text-primary-200 mb-4">
                Have a question about a charge? Our support team is here to help.
              </p>
              <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white border-none">
                Contact Support
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
