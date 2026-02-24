import { IntegrationsLayout } from '../IntegrationsLayout';
import { Card, CardBody } from '../../../../components/ui/Card';
import { Database, RefreshCw, AlertCircle } from 'lucide-react';

export function SyncDashboard() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Data Synchronization</h2>
           <p className="text-neutral-500">Monitor data flow between systems.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Database className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">450k</h3>
                    <p className="text-sm text-neutral-500">Records Synced</p>
                 </div>
              </CardBody>
           </Card>
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <RefreshCw className="w-6 h-6 text-green-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">5 mins</h3>
                    <p className="text-sm text-neutral-500">Avg Sync Time</p>
                 </div>
              </CardBody>
           </Card>
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">12</h3>
                    <p className="text-sm text-neutral-500">Conflicts</p>
                 </div>
              </CardBody>
           </Card>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
           <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Active Sync Jobs</h3>
           <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                    <div>
                       <p className="font-medium text-neutral-900 dark:text-white">Salesforce Contacts Sync</p>
                       <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 mt-2 w-32">
                          <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${i * 30}%` }}></div>
                       </div>
                    </div>
                    <span className="text-xs text-neutral-400">Running...</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
