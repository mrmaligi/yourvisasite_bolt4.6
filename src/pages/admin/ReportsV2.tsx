import { PieChart, BarChart3, TrendingUp, Users, Globe } from 'lucide-react';

export function AdminReportsV2() {
  const reportTypes = [
    { name: 'User Activity Report', description: 'Track user engagement and logins', icon: Users },
    { name: 'Revenue Analytics', description: 'Financial performance overview', icon: TrendingUp },
    { name: 'Geographic Distribution', description: 'Users by location', icon: Globe },
    { name: 'Case Success Rate', description: 'Visa approval statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400">Generate and view system reports</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {reportTypes.map((report) => (
            <div key={report.name} className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-blue-600">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <report.icon className="w-6 h-6 text-blue-600" />
                </div>
                
                <div>
                  <p className="font-semibold text-slate-900">{report.name}</p>
                  <p className="text-sm text-slate-500">{report.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Recent Reports</h2>
          
          <div className="divide-y divide-slate-200">
            {[
              { name: 'Monthly User Report', date: 'Mar 1, 2024', status: 'Generated' },
              { name: 'Q1 Revenue Summary', date: 'Feb 28, 2024', status: 'Generated' },
              { name: 'Case Analytics', date: 'Feb 15, 2024', status: 'Generated' },
            ].map((item, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.date}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
