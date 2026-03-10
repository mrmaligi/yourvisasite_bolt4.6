import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Globe } from 'lucide-react';

export function UserAnalyticsV2() {
  const stats = [
    { label: 'Applications', value: '3', change: '+1', icon: BarChart3 },
    { label: 'Documents', value: '12', change: '+5', icon: TrendingUp },
    { label: 'Consultations', value: '5', change: '+2', icon: Users },
    { label: 'Time Saved', value: '24h', change: '+8h', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Your Analytics</h1>
          <p className="text-slate-400">Track your visa journey progress</p>
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
            <h2 className="font-semibold text-slate-900 mb-4">Application Progress</h2>
            <div className="h-64 bg-slate-50 flex items-center justify-center">
              <p className="text-slate-400">Chart visualization</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Document Status</h2>
            <div className="h-64 bg-slate-50 flex items-center justify-center">
              <p className="text-slate-400">Chart visualization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
