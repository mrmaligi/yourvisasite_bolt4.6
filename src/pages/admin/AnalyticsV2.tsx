import { BarChart3, Users, DollarSign, FileText, TrendingUp } from 'lucide-react';

export function AdminAnalyticsV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-slate-400">Platform performance metrics</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-6">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-slate-600">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">12,456</p>
            <p className="text-sm text-green-600">+12% this month</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <DollarSign className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-slate-600">Revenue</p>
            <p className="text-2xl font-bold text-slate-900">$89,420</p>
            <p className="text-sm text-green-600">+23% this month</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <FileText className="w-6 h-6 text-amber-600 mb-2" />
            <p className="text-sm text-slate-600">Applications</p>
            <p className="text-2xl font-bold text-slate-900">3,247</p>
            <p className="text-sm text-blue-600">+8% this month</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm text-slate-600">Conversion</p>
            <p className="text-2xl font-bold text-slate-900">4.2%</p>
            <p className="text-sm text-green-600">+0.5% this month</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center bg-slate-50">
            <p className="text-slate-400">Chart would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
