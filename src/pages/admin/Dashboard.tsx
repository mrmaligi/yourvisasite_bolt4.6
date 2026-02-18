import { useEffect, useState } from 'react';
import { Users, Scale, FileText, DollarSign, BarChart3, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { SubscriptionStatus } from '../../components/SubscriptionStatus';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function AdminDashboard() {
  const [counts, setCounts] = useState({
    users: 0, lawyers: 0, pendingLawyers: 0, visas: 0, purchases: 0, entries: 0,
  });
  const [userGrowth, setUserGrowth] = useState<{ date: string; users: number }[]>([]);
  const [revenue, setRevenue] = useState<{ date: string; amount: number }[]>([]);

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

    const fetchCharts = async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const isoDate = sixMonthsAgo.toISOString();

      // User Growth
      const { data: users } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', isoDate)
        .order('created_at');

      if (users) {
        const grouped = users.reduce((acc: any, curr) => {
          const month = new Date(curr.created_at).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        // Ensure chronological order
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const m = d.toLocaleString('default', { month: 'short' });
            months.push({ date: m, users: grouped[m] || 0 });
        }
        setUserGrowth(months);
      }

      // Revenue
      const { data: purchases } = await supabase
        .from('user_visa_purchases')
        .select('created_at:purchased_at, amount_cents')
        .gte('purchased_at', isoDate)
        .order('purchased_at');

      if (purchases) {
        const grouped = purchases.reduce((acc: any, curr) => {
          const month = new Date(curr.created_at).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + (curr.amount_cents / 100);
          return acc;
        }, {});

        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const m = d.toLocaleString('default', { month: 'short' });
            months.push({ date: m, amount: grouped[m] || 0 });
        }
        setRevenue(months);
      }
    };

    fetchCharts();
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
        <Card>
            <CardHeader><h3 className="font-semibold text-neutral-900">New Users (6 Months)</h3></CardHeader>
            <CardBody className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="users" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>

        <Card>
            <CardHeader><h3 className="font-semibold text-neutral-900">Revenue (6 Months)</h3></CardHeader>
            <CardBody className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenue}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(val) => `$${val}`} />
                        <Tooltip formatter={(val: number) => `$${val.toFixed(2)}`} />
                        <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
      </div>
    </div>
  );
}
