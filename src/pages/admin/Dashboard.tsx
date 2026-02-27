import { useEffect, useState } from 'react';
import { Users, Scale, FileText, DollarSign, BarChart3, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/Card';

export function AdminDashboard() {
  const [counts, setCounts] = useState({
    users: 0, lawyers: 0, pendingLawyers: 0, visas: 0, purchases: 0, entries: 0,
  });

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{kpi.value}</p>
                <p className="text-xs text-neutral-500">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
