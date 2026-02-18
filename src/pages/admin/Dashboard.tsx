import { useEffect, useState } from 'react';
import { Users, Scale, FileText, DollarSign, BarChart3, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { SubscriptionStatus } from '../../components/SubscriptionStatus';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

interface ChartData {
  userGrowth: { date: string; count: number }[];
  revenue: { date: string; amount: number }[];
  popularVisas: { name: string; count: number }[];
}

export function AdminDashboard() {
  const [counts, setCounts] = useState({
    users: 0, lawyers: 0, pendingLawyers: 0, visas: 0, purchases: 0, entries: 0,
  });

  const [charts, setCharts] = useState<ChartData>({
    userGrowth: [],
    revenue: [],
    popularVisas: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Counts
      const [users, lawyers, pending, visas, purchases, entries] = await Promise.all([
        supabase.from('profiles').select('created_at', { count: 'exact' }),
        supabase.schema('lawyer').from('profiles').select('id', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.schema('lawyer').from('profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
        supabase.from('visas').select('id, name', { count: 'exact' }),
        supabase.from('user_visa_purchases').select('amount_cents, purchased_at, visa_id', { count: 'exact' }),
        supabase.from('tracker_entries').select('id', { count: 'exact', head: true }),
      ]);

      setCounts({
        users: users.count || 0,
        lawyers: lawyers.count || 0,
        pendingLawyers: pending.count || 0,
        visas: visas.count || 0,
        purchases: purchases.count || 0,
        entries: entries.count || 0,
      });

      // 2. Process User Growth (Last 30 days)
      const userGrowthMap = new Map<string, number>();
      users.data?.forEach((u) => {
        const date = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        userGrowthMap.set(date, (userGrowthMap.get(date) || 0) + 1);
      });
      // Sort by date roughly (this is a simple approximation, for production we'd use proper date objects)
      const userGrowth = Array.from(userGrowthMap.entries())
        .map(([date, count]) => ({ date, count }))
        .slice(-30); // simplistic logic, better to fill gaps

      // 3. Process Revenue
      const revenueMap = new Map<string, number>();
      purchases.data?.forEach((p) => {
        const date = new Date(p.purchased_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        revenueMap.set(date, (revenueMap.get(date) || 0) + (p.amount_cents / 100));
      });
      const revenue = Array.from(revenueMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .slice(-30);

      // 4. Process Popular Visas
      const visaNames = new Map(visas.data?.map((v) => [v.id, v.name]));
      const visaCounts = new Map<string, number>();
      purchases.data?.forEach((p) => {
        const name = visaNames.get(p.visa_id) || 'Unknown';
        visaCounts.set(name, (visaCounts.get(name) || 0) + 1);
      });
      const popularVisas = Array.from(visaCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setCharts({ userGrowth, revenue, popularVisas });
      setLoading(false);
    };

    fetchData();
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">User Growth</h3>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Revenue (AUD)</h3>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Most Popular Guides</h3>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.popularVisas} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} width={150} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
