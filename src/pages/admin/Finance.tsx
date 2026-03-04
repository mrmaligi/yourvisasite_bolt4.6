import { useState, useEffect } from 'react';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

interface Transaction {
  id: string;
  user: string;
  description: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  date: string;
  paymentMethod: string;
  type: 'purchase' | 'booking';
}

export function Finance() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgOrderValue: 0,
    totalTransactions: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);

      // Fetch all purchases
      const { data: purchases } = await supabase
        .from('user_visa_purchases')
        .select('id, amount_cents, purchased_at, user_id')
        .order('purchased_at', { ascending: false });

      // Fetch all completed bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, amount_cents, created_at, status')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      const purchaseTransactions: Transaction[] = (purchases || []).map((p) => ({
        id: p.id,
        user: `User ${p.user_id?.slice(0, 8) || 'Unknown'}`,
        description: 'Visa Guide Purchase',
        amount: p.amount_cents / 100,
        status: 'succeeded',
        date: p.purchased_at,
        paymentMethod: 'Stripe',
        type: 'purchase',
      }));

      const bookingTransactions: Transaction[] = (bookings || []).map((b) => ({
        id: b.id,
        user: 'Lawyer Consultation',
        description: 'Consultation Fee',
        amount: b.amount_cents / 100,
        status: 'succeeded',
        date: b.created_at,
        paymentMethod: 'Stripe',
        type: 'booking',
      }));

      const allTransactions = [...purchaseTransactions, ...bookingTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setTransactions(allTransactions);

      // Calculate stats
      const totalRevenue = allTransactions.reduce((sum, t) => sum + t.amount, 0);
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyRevenue = allTransactions
        .filter((t) => new Date(t.date) >= monthStart)
        .reduce((sum, t) => sum + t.amount, 0);
      const avgOrderValue = allTransactions.length > 0 ? totalRevenue / allTransactions.length : 0;

      setStats({
        totalRevenue,
        monthlyRevenue,
        avgOrderValue,
        totalTransactions: allTransactions.length,
      });

      // Generate monthly revenue chart data
      const monthlyData: Record<string, { purchases: number; bookings: number }> = {};
      allTransactions.forEach((t) => {
        const date = new Date(t.date);
        const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (!monthlyData[key]) {
          monthlyData[key] = { purchases: 0, bookings: 0 };
        }
        if (t.type === 'purchase') {
          monthlyData[key].purchases += t.amount;
        } else {
          monthlyData[key].bookings += t.amount;
        }
      });

      const chartData = Object.entries(monthlyData)
        .map(([name, data]) => ({
          name,
          purchases: Math.round(data.purchases),
          bookings: Math.round(data.bookings),
        }))
        .slice(-6);

      setRevenueData(chartData);
    } catch (error) {
      console.error('Error fetching finance data:', error);
      toast('error', 'Failed to load finance data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Description', 'Customer', 'Amount', 'Status', 'Date', 'Type'];
    const csvContent = [
      headers.join(','),
      ...transactions.map((t) =>
        [
          t.id,
          `"${t.description}"`,
          `"${t.user}"`,
          t.amount.toFixed(2),
          t.status,
          new Date(t.date).toISOString(),
          t.type,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast('success', 'Transactions exported');
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{row.description}</p>
          <p className="text-xs text-neutral-500">{row.id.slice(0, 8)}...</p>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Customer',
      render: (row) => <span className="text-sm text-neutral-600 dark:text-neutral-400">{row.user}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => (
        <Badge variant={row.type === 'purchase' ? 'default' : 'secondary'}>
          {row.type === 'purchase' ? 'Purchase' : 'Booking'}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => (
        <span className="font-medium text-neutral-900 dark:text-white">${row.amount.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge
          variant={
            row.status === 'succeeded'
              ? 'success'
              : row.status === 'pending'
              ? 'warning'
              : row.status === 'failed'
              ? 'danger'
              : 'default'
          }
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => (
        <span className="text-sm text-neutral-500">{new Date(row.date).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Finance</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Revenue, transactions, and financial overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Revenue</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">This Month</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  ${stats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Avg Order Value</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  ${stats.avgOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Transactions</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalTransactions}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Revenue Chart */}
      {revenueData.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900 dark:text-white">Revenue Overview</h2>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number | undefined) => value !== undefined ? `$${value}` : ''} />
                  <Legend />
                  <Bar dataKey="purchases" name="Visa Purchases" fill="#8b5cf6" />
                  <Bar dataKey="bookings" name="Consultations" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-neutral-900 dark:text-white">Recent Transactions</h2>
        </CardHeader>
        <CardBody>
          <DataTable<Transaction>
            columns={columns}
            data={transactions.slice(0, 20)}
            loading={loading}
            emptyMessage="No transactions found"
          />
        </CardBody>
      </Card>
    </div>
  );
}
