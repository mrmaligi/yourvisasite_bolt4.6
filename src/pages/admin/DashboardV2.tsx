import { BarChart3, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export function AdminDashboardV2() {
  const stats = [
    { label: 'Total Users', value: '1,240', change: '+5%', icon: Users },
    { label: 'Revenue', value: '$45,250', change: '+12%', icon: DollarSign },
    { label: 'Active Cases', value: '342', change: '+8%', icon: BarChart3 },
    { label: 'Consultations', value: '156', change: '+15%', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Platform overview and analytics</p>
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
            <h2 className="font-semibold text-slate-900 mb-4">Revenue Overview</h2>
            <div className="h-64 bg-slate-50 flex items-center justify-center">
              <p className="text-slate-400">Chart visualization</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
            
            <div className="space-y-4">
              {[
                { action: 'New user registered', time: '2 min ago' },
                { action: 'Payment received', time: '5 min ago' },
                { action: 'New case created', time: '12 min ago' },
                { action: 'Consultation booked', time: '18 min ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700">{item.action}</span>
                  <span className="text-sm text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
