import { Helmet } from 'react-helmet-async';
import { TrendingUp, Users, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const EARNINGS_DATA = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 4500 },
  { name: 'May', amount: 6000 },
  { name: 'Jun', amount: 5500 },
];

const CLIENTS_DATA = [
  { name: 'Jan', count: 12 },
  { name: 'Feb', count: 15 },
  { name: 'Mar', count: 18 },
  { name: 'Apr', count: 16 },
  { name: 'May', count: 22 },
  { name: 'Jun', count: 25 },
];

export function AnalyticsV2() {
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
                <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
                <p className="text-slate-600">Track your practice performance and growth</p>
              </div>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Revenue', value: '$28,000', change: '+12%', icon: DollarSign, color: 'bg-green-100 text-green-600' },
              { label: 'New Clients', value: '25', change: '+8%', icon: Users, color: 'bg-blue-100 text-blue-600' },
              { label: 'Consultations', value: '48', change: '+15%', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
              { label: 'Conversion Rate', value: '68%', change: '+5%', icon: TrendingUp, color: 'bg-yellow-100 text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                    <span className="text-xs text-green-600">{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Monthly Revenue</h2>
              
              <div className="space-y-3">
                {EARNINGS_DATA.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="w-8 text-sm text-slate-600">{d.name}</span>
                    <div className="flex-1 h-6 bg-slate-100">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${(d.amount / 6000) * 100}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-sm font-medium text-slate-900">
                      ${(d.amount / 1000).toFixed(1)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">New Clients</h2>
              
              <div className="space-y-3">
                {CLIENTS_DATA.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="w-8 text-sm text-slate-600">{d.name}</span>
                    <div className="flex-1 h-6 bg-slate-100">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(d.count / 25) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-medium text-slate-900">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Performing Services</h2>
            
            <div className="space-y-4">
              {[
                { name: 'Partner Visa Consultation', revenue: 8500, clients: 12 },
                { name: 'Skilled Migration Assessment', revenue: 6200, clients: 8 },
                { name: 'Document Review Service', revenue: 4800, clients: 15 },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">{s.name}</p>
                    <p className="text-sm text-slate-500">{s.clients} clients</p>
                  </div>
                  <p className="font-semibold text-slate-900">${s.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
