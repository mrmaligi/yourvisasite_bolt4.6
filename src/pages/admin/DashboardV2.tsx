import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Scale, FileText, DollarSign, BarChart3, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function DashboardV2() {
  const [counts] = useState({
    users: 1250,
    lawyers: 45,
    pendingLawyers: 8,
    visas: 85,
    purchases: 320,
    entries: 1500,
  });

  const kpis = [
    { label: 'Total Users', value: counts.users, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Verified Lawyers', value: counts.lawyers, icon: Scale, color: 'bg-green-100 text-green-600' },
    { label: 'Pending Verifications', value: counts.pendingLawyers, icon: ShieldCheck, color: 'bg-amber-100 text-amber-600' },
    { label: 'Visa Types', value: counts.visas, icon: FileText, color: 'bg-purple-100 text-purple-600' },
    { label: 'Guide Purchases', value: counts.purchases, icon: DollarSign, color: 'bg-pink-100 text-pink-600' },
    { label: 'Tracker Entries', value: counts.entries, icon: BarChart3, color: 'bg-slate-100 text-slate-600' },
  ];

  const quickLinks = [
    { label: 'Manage Visas', href: '/admin/visas' },
    { label: 'User Management', href: '/admin/users' },
    { label: 'Content', href: '/admin/content' },
    { label: 'Bookings', href: '/admin/bookings' },
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
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{kpi.value.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">{kpi.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h2>
              
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors"
                  >
                    <span className="text-slate-700">{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
              
              <div className="space-y-3">
                {[
                  { action: 'New user registered', time: '2 minutes ago' },
                  { action: 'Lawyer verification approved', time: '15 minutes ago' },
                  { action: 'Visa guide purchased', time: '1 hour ago' },
                  { action: 'New booking created', time: '2 hours ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
                    <span className="text-slate-700">{item.action}</span>
                    <span className="text-sm text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
