import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export function ContentPerformanceV2() {
  const metrics = [
    { label: 'Page Views', value: '45.2K', change: '+12%', up: true },
    { label: 'Unique Visitors', value: '18.5K', change: '+8%', up: true },
    { label: 'Avg. Time on Page', value: '3:45', change: '-5%', up: false },
    { label: 'Bounce Rate', value: '42%', change: '-3%', up: true },
  ];

  const topPages = [
    { path: '/visas/partner', views: '12.5K', title: 'Partner Visa Guide' },
    { path: '/visas/skilled', views: '8.2K', title: 'Skilled Migration' },
    { path: '/pricing', views: '6.8K', title: 'Pricing Page' },
    { path: '/blog/visa-tips', views: '4.1K', title: 'Top Visa Tips' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Content Performance</h1>
          <p className="text-slate-600">Track how your content is performing</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">{m.label}</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-slate-900">{m.value}</p>
                <span className={`text-sm ${m.up ? 'text-green-600' : 'text-red-600'}`}>
                  {m.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Top Performing Pages</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {topPages.map((page) => (
              <div key={page.path} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{page.title}</p>
                  <p className="text-sm text-slate-500">{page.path}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-700">{page.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
