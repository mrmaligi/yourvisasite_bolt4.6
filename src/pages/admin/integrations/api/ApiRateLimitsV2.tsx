import { Gauge, AlertTriangle, Info } from 'lucide-react';

export function ApiRateLimitsV2() {
  const limits = [
    { tier: 'Free', requests: '100', window: 'per hour', usage: 45 },
    { tier: 'Basic', requests: '1,000', window: 'per hour', usage: 67 },
    { tier: 'Pro', requests: '10,000', window: 'per hour', usage: 23 },
    { tier: 'Enterprise', requests: 'Unlimited', window: '', usage: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">API Rate Limits</h1>
          <p className="text-slate-600">Configure rate limiting for API tiers</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-800">Changes to rate limits will take effect immediately.</p>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Tier</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Request Limit</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Current Usage</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {limits.map((limit) => (
                <tr key={limit.tier}>
                  <td className="px-6 py-4 font-medium text-slate-900">{limit.tier}</td>
                  <td className="px-6 py-4 text-slate-700">{limit.requests} {limit.window}</td>
                  <td className="px-6 py-4">
                    {limit.usage > 0 ? (
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{limit.usage}%</span>
                        </div>
                        <div className="h-2 bg-slate-100">
                          <div className={`h-2 ${limit.usage > 80 ? 'bg-red-600' : limit.usage > 50 ? 'bg-amber-500' : 'bg-green-600'}`} style={{ width: `${limit.usage}%` }} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
