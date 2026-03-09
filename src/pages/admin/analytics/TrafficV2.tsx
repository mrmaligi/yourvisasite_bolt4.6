import { Video, FileText, Lock, Unlock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function TrafficV2() {
  const sources = [
    { name: 'Organic Search', visitors: '8,450', percentage: 45 },
    { name: 'Direct', visitors: '4,230', percentage: 23 },
    { name: 'Social Media', visitors: '3,120', percentage: 17 },
    { name: 'Referral', visitors: '1,890', percentage: 10 },
    { name: 'Email', visitors: '960', percentage: 5 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Traffic Sources</h1>
          <p className="text-slate-600">Understand where your visitors come from</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Visitors', value: '18,650' },
            { label: 'Avg. Session', value: '3:45' },
            { label: 'Bounce Rate', value: '42%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {sources.map((source) => (
              <div key={source.name} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{source.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600">{source.visitors}</span>
                    <span className="font-semibold text-slate-900 w-12 text-right">{source.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100">
                  <div className="h-2 bg-blue-600" style={{ width: `${source.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
