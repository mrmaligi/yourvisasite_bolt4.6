import { LayoutDashboard, BarChart3, Activity } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApiDashboardV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">API Dashboard</h1>
          <p className="text-slate-600">Monitor your API usage and performance</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requests', value: '45.2K', icon: BarChart3 },
            { label: 'Success Rate', value: '99.2%', icon: Activity },
            { label: 'Avg Latency', value: '45ms', icon: Activity },
            { label: 'Active Keys', value: '12', icon: LayoutDashboard },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <stat.icon className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Request Volume</h2>
          <div className="h-64 bg-slate-50 flex items-center justify-center">
            <p className="text-slate-400">Chart visualization would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
