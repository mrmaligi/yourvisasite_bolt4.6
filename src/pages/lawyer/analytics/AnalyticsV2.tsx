import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BarChart as BarChartIcon, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface AnalyticsData {
  revenue: number;
  clients: number;
  consultations: number;
  growth: number;
}

export function AnalyticsV2() {
  const [data] = useState<AnalyticsData>({
    revenue: 12500,
    clients: 45,
    consultations: 28,
    growth: 15,
  });

  const stats = [
    { label: 'Total Revenue', value: `$${data.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Clients', value: data.clients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Consultations', value: data.consultations, icon: BarChartIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Growth', value: `+${data.growth}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 2000 },
    { month: 'Apr', revenue: 2780 },
    { month: 'May', revenue: 1890 },
    { month: 'Jun', revenue: 2390 },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Practice Analytics</h1>
                <p className="text-slate-600">Overview of your practice performance</p>
              </div>
              <Button variant="outline">Export Report</Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Revenue Overview</h2>
            
            <div className="space-y-4">
              {monthlyData.map((item) => (
                <div key={item.month} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-slate-600">{item.month}</span>
                  <div className="flex-1 bg-slate-100 h-8">
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${(item.revenue / 5000) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-right text-sm font-medium text-slate-900">${item.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
