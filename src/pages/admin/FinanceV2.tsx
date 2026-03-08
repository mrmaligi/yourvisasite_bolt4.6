import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';

export function FinanceV2() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 125000,
    monthlyRevenue: 15000,
    avgOrderValue: 85,
    totalTransactions: 1470,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('bookings')
        .select('id, amount_cents, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge variant="success">Succeeded</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'cancelled': return <Badge variant="danger">Failed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Finance | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
                <p className="text-slate-600">Revenue and transaction overview</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 30 Days
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { 
                label: 'Total Revenue', 
                value: `$${stats.totalRevenue.toLocaleString()}`, 
                change: '+12%',
                icon: DollarSign,
                trend: 'up'
              },
              { 
                label: 'Monthly Revenue', 
                value: `$${stats.monthlyRevenue.toLocaleString()}`, 
                change: '+8%',
                icon: TrendingUp,
                trend: 'up'
              },
              { 
                label: 'Avg Order Value', 
                value: `$${stats.avgOrderValue}`, 
                change: '-2%',
                icon: TrendingDown,
                trend: 'down'
              },
              { 
                label: 'Transactions', 
                value: stats.totalTransactions.toLocaleString(), 
                change: '+15%',
                icon: DollarSign,
                trend: 'up'
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant={stat.trend === 'up' ? 'success' : 'danger'}>{stat.change}</Badge>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Placeholder - SQUARE */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Overview</h3>
              <div className="h-64 bg-slate-50 border border-slate-200 flex items-center justify-center">
                <p className="text-slate-500">Chart placeholder</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Transactions by Type</h3>
              <div className="h-64 bg-slate-50 border border-slate-200 flex items-center justify-center">
                <p className="text-slate-500">Chart placeholder</p>
              </div>
            </div>
          </div>

          {/* Transactions Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Transaction ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No transactions found</td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{t.id.slice(0, 8)}...</td>
                        <td className="px-6 py-4 font-medium text-slate-900">${(t.amount_cents / 100).toFixed(2)}</td>
                        <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                        <td className="px-6 py-4 text-slate-600">{new Date(t.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
