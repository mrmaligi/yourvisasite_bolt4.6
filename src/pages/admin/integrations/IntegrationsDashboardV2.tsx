import { LayoutDashboard, Link, Settings, Activity } from 'lucide-react';

export function IntegrationsDashboardV2() {
  const integrations = [
    { name: 'Stripe', status: 'connected', type: 'Payment' },
    { name: 'SendGrid', status: 'connected', type: 'Email' },
    { name: 'AWS S3', status: 'connected', type: 'Storage' },
    { name: 'Slack', status: 'disconnected', type: 'Notifications' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
          <p className="text-slate-600">Manage your connected services</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Connected', value: '3', icon: Link },
            { label: 'Available', value: '12', icon: LayoutDashboard },
            { label: 'API Calls Today', value: '2,450', icon: Activity },
            { label: 'Pending Setup', value: '1', icon: Settings },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <stat.icon className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {integrations.map((integration) => (
              <div key={integration.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <span className="font-bold text-slate-600">{integration.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{integration.name}</p>
                    <p className="text-sm text-slate-500">{integration.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium ${
                  integration.status === 'connected' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
