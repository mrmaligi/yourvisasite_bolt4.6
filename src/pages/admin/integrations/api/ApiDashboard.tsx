import { IntegrationsLayout } from '../IntegrationsLayout';
import { Card, CardBody } from '../../../../components/ui/Card';
import { Activity, Key, Lock } from 'lucide-react';

export function ApiDashboard() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">API Overview</h2>
           <p className="text-neutral-500">Monitor API usage and health.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Activity className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">99.9%</h3>
                    <p className="text-sm text-neutral-500">Uptime</p>
                 </div>
              </CardBody>
           </Card>
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Key className="w-6 h-6 text-green-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">42</h3>
                    <p className="text-sm text-neutral-500">Active Keys</p>
                 </div>
              </CardBody>
           </Card>
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Lock className="w-6 h-6 text-purple-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Low</h3>
                    <p className="text-sm text-neutral-500">Error Rate</p>
                 </div>
              </CardBody>
           </Card>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
           <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Recent API Calls</h3>
           <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                    <div>
                       <p className="font-medium text-neutral-900 dark:text-white">GET /api/v1/visas</p>
                       <p className="text-xs text-neutral-500">200 OK • 120ms</p>
                    </div>
                    <span className="text-xs text-neutral-400">Just now</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
