import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Scale, FileText, DollarSign, BarChart3, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface DashboardStats {
  users: number;
  lawyers: number;
  pendingLawyers: number;
  visas: number;
  purchases: number;
  entries: number;
}

export function DashboardV2() {
  const [stats] = useState<DashboardStats>({
    users: 1245,
    lawyers: 89,
    pendingLawyers: 12,
    visas: 156,
    purchases: 342,
    entries: 892,
  });

  const kpis = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Verified Lawyers', value: stats.lawyers, icon: Scale, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Verifications', value: stats.pendingLawyers, icon: ShieldCheck, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Visa Types', value: stats.visas, icon: FileText, color: 'bg-purple-50 text-purple-600' },
    { label: 'Guide Purchases', value: stats.purchases, icon: DollarSign, color: 'bg-orange-50 text-orange-600' },
    { label: 'Tracker Entries', value: stats.entries, icon: BarChart3, color: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Platform overview and key metrics</p>
              </div>
              <Button variant="outline">Refresh</Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                    <p className="text-sm text-slate-600">{kpi.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { action: 'New user registered', time: '2 min ago' },
                  { action: 'Lawyer verification approved', time: '15 min ago' },
                  { action: 'Visa guide purchased', time: '1 hour ago' },
                  { action: 'New tracker entry', time: '2 hours ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700">{item.action}</span>
                    <span className="text-sm text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">Manage Users</Button>
                <Button variant="outline" className="justify-start">Review Lawyers</Button>
                <Button variant="outline" className="justify-start">View Reports</Button>
                <Button variant="outline" className="justify-start">System Settings</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
