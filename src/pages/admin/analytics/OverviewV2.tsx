import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function OverviewV2() {
  const stats = [
    { label: 'Total Users', value: '28,450', change: '+12%', up: true },
    { label: 'Revenue', value: '$124,500', change: '+23%', up: true },
    { label: 'Visa Apps', value: '1,240', change: '+8%', up: true },
    { label: 'Consultations', value: '456', change: '-3%', up: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Analytics Overview</h1>
          <p className="text-slate-600">Key metrics and performance indicators</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 p-6">
              <p className="text-sm text-slate-600">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
              <div className={`flex items-center gap-1 mt-2 ${s.up ? 'text-green-600' : 'text-red-600'}`}>
                {s.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span className="text-sm">{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Traffic Overview</h2>
            <div className="h-48 bg-slate-50 flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-slate-300" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'New user registered', time: '2 min ago' },
                { action: 'Visa application submitted', time: '5 min ago' },
                { action: 'Consultation booked', time: '12 min ago' },
                { action: 'Payment received', time: '18 min ago' },
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
