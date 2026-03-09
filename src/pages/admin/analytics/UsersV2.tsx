import { Users, TrendingUp, UserPlus, UserMinus } from 'lucide-react';

export function UsersV2() {
  const stats = [
    { label: 'Total Users', value: '12,450', change: '+5%', icon: Users },
    { label: 'New This Month', value: '1,240', change: '+12%', icon: UserPlus },
    { label: 'Churned', value: '89', change: '-3%', icon: UserMinus },
    { label: 'Active Now', value: '456', change: '+8%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">User Analytics</h1>
          <p className="text-slate-600">Understand your user base</p>
        </div>

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

        <div className="bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">User Growth</h2>          <div className="h-64 bg-slate-50 flex items-center justify-center">
            <p className="text-slate-400">User growth chart will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
