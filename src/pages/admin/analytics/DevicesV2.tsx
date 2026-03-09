import { Monitor, Smartphone, Tablet, Globe } from 'lucide-react';

export function DevicesV2() {
  const devices = [
    { name: 'Desktop', percentage: 58, icon: Monitor, color: 'bg-blue-600' },
    { name: 'Mobile', percentage: 35, icon: Smartphone, color: 'bg-green-600' },
    { name: 'Tablet', percentage: 7, icon: Tablet, color: 'bg-amber-600' },
  ];

  const browsers = [
    { name: 'Chrome', share: '62%' },
    { name: 'Safari', share: '18%' },
    { name: 'Firefox', share: '8%' },
    { name: 'Edge', share: '7%' },
    { name: 'Other', share: '5%' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Devices</h1>
          <p className="text-slate-600">Understand how users access your platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-6">Device Breakdown</h2>
            <div className="space-y-6">
              {devices.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <d.icon className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-900">{d.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{d.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-100">
                    <div className={`h-2 ${d.color}`} style={{ width: `${d.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-6">Browser Share</h2>
            <div className="space-y-4">
              {browsers.map((b) => (
                <div key={b.name} className="flex items-center justify-between">
                  <span className="text-slate-700">{b.name}</span>
                  <span className="font-medium text-slate-900">{b.share}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
