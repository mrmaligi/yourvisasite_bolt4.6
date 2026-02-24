import { IntegrationsLayout } from '../IntegrationsLayout';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { RefreshCw } from 'lucide-react';

export function SyncStatus() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Sync Status</h2>
             <p className="text-neutral-500">Current state of all integrations.</p>
           </div>
           <Button variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
           </Button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                 <tr>
                    <th className="px-6 py-4">Integration</th>
                    <th className="px-6 py-4">Direction</th>
                    <th className="px-6 py-4">Last Sync</th>
                    <th className="px-6 py-4">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">Salesforce</td>
                    <td className="px-6 py-4 text-neutral-500">Bidirectional</td>
                    <td className="px-6 py-4 text-neutral-500">10 mins ago</td>
                    <td className="px-6 py-4"><Badge variant="success">Synced</Badge></td>
                 </tr>
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">HubSpot</td>
                    <td className="px-6 py-4 text-neutral-500">Export Only</td>
                    <td className="px-6 py-4 text-neutral-500">1 hour ago</td>
                    <td className="px-6 py-4"><Badge variant="success">Synced</Badge></td>
                 </tr>
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">QuickBooks</td>
                    <td className="px-6 py-4 text-neutral-500">Export Only</td>
                    <td className="px-6 py-4 text-neutral-500">1 day ago</td>
                    <td className="px-6 py-4"><Badge variant="warning">Partial Failure</Badge></td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
