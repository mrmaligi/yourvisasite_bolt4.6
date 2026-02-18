import { useEffect, useState } from 'react';
import { Users, Scale, FileText, DollarSign, BarChart3, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { SubscriptionStatus } from '../../components/SubscriptionStatus';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function AdminDashboard() {
  const [counts, setCounts] = useState({
    users: 0, lawyers: 0, pendingLawyers: 0, visas: 0, purchases: 0, entries: 0,
  });
  const [chartData, setChartData] = useState<{ date: string; users: number }[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.schema('lawyer').from('profiles').select('id', { count: 'exact', head: true }).eq('is_verified', true),
      supabase.schema('lawyer').from('profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
      supabase.from('visas').select('id', { count: 'exact', head: true }),
      supabase.from('user_visa_purchases').select('id', { count: 'exact', head: true }),
      supabase.from('tracker_entries').select('id', { count: 'exact', head: true }),
    ]).then(([users, lawyers, pending, visas, purchases, entries]) => {
      setCounts({
        users: users.count || 0,
        lawyers: lawyers.count || 0,
        pendingLawyers: pending.count || 0,
        visas: visas.count || 0,
        purchases: purchases.count || 0,
        entries: entries.count || 0,
      });
    });

    const fetchChartData = async () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const { data } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (data) {
        const grouped = data.reduce((acc, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const newChartData = [];
        for (let i = 0; i < 30; i++) {
          const d = new Date(thirtyDaysAgo);
          d.setDate(d.getDate() + i + 1); // +1 to ensure we end on today
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          newChartData.push({
            date: dateStr,
            users: grouped[dateStr] || 0
          });
        }
        setChartData(newChartData);
      }
    };
    fetchChartData();
  }, []);

  const kpis = [
    { label: 'Total Users', value: counts.users, icon: Users, color: 'bg-sky-50 text-sky-600' },
    { label: 'Verified Lawyers', value: counts.lawyers, icon: Scale, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Verifications', value: counts.pendingLawyers, icon: ShieldCheck, color: 'bg-amber-50 text-amber-600' },
    { label: 'Visa Types', value: counts.visas, icon: FileText, color: 'bg-primary-50 text-primary-600' },
    { label: 'Guide Purchases', value: counts.purchases, icon: DollarSign, color: 'bg-accent-50 text-accent-600' },
    { label: 'Tracker Entries', value: counts.entries, icon: BarChart3, color: 'bg-neutral-100 text-neutral-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-500 mt-1">Platform overview and key metrics.</p>
      </div>
      
      <SubscriptionStatus />
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardBody className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{kpi.value}</p>
                <p className="text-xs text-neutral-500">{kpi.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">User Growth (Last 30 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#737373', fontSize: 12 }}
                  minTickGap={30}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#737373', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
