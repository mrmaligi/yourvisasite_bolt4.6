import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Globe } from 'lucide-react';

export function DashboardStatsV2() {
  const stats = [
    { label: 'Total Users', value: '12,456', change: '+12%', icon: Users },
    { label: 'Active Cases', value: '3,842', change: '+8%', icon: BarChart3 },
    { label: 'Revenue', value: '$145,250', change: '+23%', icon: DollarSign },
    { label: 'Conversion', value: '8.4%', change: '+2%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Platform overview</p>
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
            <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
            
            <div className="space-y-4">
              {[
                { action: 'New user registered', time: '2 min ago' },
                { action: 'Payment received', time: '5 min ago' },
                { action: 'New case created', time: '12 min ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700">{item.action}</span>
                  <span className="text-sm text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Top Visas</h2>
            
            <div className="space-y-4">
              {[
                { name: 'Partner Visa', count: 1234 },
                { name: 'Student Visa', count: 892 },
                { name: 'Skilled Independent', count: 756 },
              ].map((visa, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-slate-700">{visa.name}</span>
                  <span className="text-slate-500">{visa.count} applications</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
