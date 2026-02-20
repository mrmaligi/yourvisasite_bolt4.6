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

interface Transaction {
  id: string;
  user: string;
  description: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  date: string;
  paymentMethod: string;
}

const REVENUE_DATA = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

export function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgOrderValue: 0,
    refundRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      // Fetch purchases
      const { data: purchases } = await supabase
        .from('user_visa_purchases')
        .select('id, amount_cents, purchased_at, user_id')
        .order('purchased_at', { ascending: false })
        .limit(20);

      // Fetch bookings (revenue)
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, total_price_cents, created_at, status')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(20);

      const purchaseTransactions: Transaction[] = (purchases || []).map(p => ({
        id: p.id,
        user: `User ${p.user_id.slice(0, 4)}`,
        description: 'Visa Guide Purchase',
        amount: p.amount_cents / 100,
        status: 'succeeded',
        date: p.purchased_at,
        paymentMethod: 'Stripe'
      }));

      const bookingTransactions: Transaction[] = (bookings || []).map(b => ({
        id: b.id,
        user: 'Lawyer Consultation',
        description: 'Consultation Fee',
        amount: b.total_price_cents / 100,
        status: 'succeeded',
        date: b.created_at,
        paymentMethod: 'Stripe'
      }));

      const allTransactions = [...purchaseTransactions, ...bookingTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setTransactions(allTransactions);

      // Calculate stats (Mock logic for total revenue based on fetched sample + mock base)
      const sampleTotal = allTransactions.reduce((sum, t) => sum + t.amount, 0);
      setStats({
        totalRevenue: 154200 + sampleTotal,
        monthlyRevenue: 12450 + (sampleTotal * 0.2),
        avgOrderValue: 85,
        refundRate: 2.4,
      });

    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{row.description}</p>
          <p className="text-xs text-neutral-500">{row.id}</p>
        </div>
      )
    },
    {
      key: 'user',
      header: 'Customer',
      render: (row) => <span className="text-sm text-neutral-600 dark:text-neutral-400">{row.user}</span>
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => <span className="font-medium text-neutral-900 dark:text-white">${row.amount.toFixed(2)}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={
          row.status === 'succeeded' ? 'success' :
          row.status === 'pending' ? 'warning' :
          row.status === 'failed' ? 'danger' : 'secondary'
        } className="capitalize">
          {row.status}
        </Badge>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="text-xs text-neutral-500">{new Date(row.date).toLocaleDateString()}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Financial Overview</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Revenue, transactions, and payouts</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="secondary" className="flex items-center gap-2">
             <Filter className="w-4 h-4" /> Filter
           </Button>
           <Button variant="secondary" className="flex items-center gap-2">
             <Download className="w-4 h-4" /> Export Report
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-500 text-sm">Total Revenue</span>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</span>
              <span className="text-xs font-medium text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.5%
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-500 text-sm">Monthly Recurring</span>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900 dark:text-white">${stats.monthlyRevenue.toLocaleString()}</span>
              <span className="text-xs font-medium text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +5.2%
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-500 text-sm">Avg. Order Value</span>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CreditCard className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900 dark:text-white">${stats.avgOrderValue}</span>
              <span className="text-xs font-medium text-red-600 flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> -1.2%
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-500 text-sm">Refund Rate</span>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.refundRate}%</span>
              <span className="text-xs font-medium text-green-600 flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> -0.5%
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Revenue Overview</h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#A3A3A3" fontSize={12} />
                  <YAxis stroke="#A3A3A3" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <Tooltip
                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Expenses/Profit Chart (Simplified) */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Profit Margins</h2>
          </CardHeader>
          <CardBody>
             <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA.slice(-4)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <XAxis dataKey="name" stroke="#A3A3A3" fontSize={12} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#f43f5e" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Transactions</h2>
        </CardHeader>
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            data={transactions}
            keyExtractor={(row) => row.id}
            searchable
            searchPlaceholder="Search transactions..."
            pageSize={10}
            loading={loading}
          />
        </CardBody>
      </Card>
    </div>
  );
}
