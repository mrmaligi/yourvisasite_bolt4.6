import { Globe, Users, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

export function AdminOverviewV2() {
  const stats = [
    { label: 'Total Users', value: '12,456', change: '+12%', icon: Users },
    { label: 'Active Cases', value: '3,842', change: '+8%', icon: BarChart3 },
    { label: 'Revenue (MTD)', value: '$145,250', change: '+23%', icon: DollarSign },
    { label: 'Conversion Rate', value: '8.4%', change: '+2%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-slate-400">Platform performance overview</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-6">
              <stat.icon className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-slate-600">{stat.label}</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">User Growth</h2>
            <div className="h-64 bg-slate-50 flex items-center justify-center">
              <p className="text-slate-400">Chart visualization</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Revenue Trend</h2>
            <div className="h-64 bg-slate-50 flex items-center justify-center">
              <p className="text-slate-400">Chart visualization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
