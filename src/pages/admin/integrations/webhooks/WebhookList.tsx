import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';
import { Plus, MoreVertical } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';

export function WebhookList() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Subscriptions</h2>
             <p className="text-neutral-500">Manage active webhook endpoints.</p>
           </div>
           <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Endpoint
           </Button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                 <tr>
                    <th className="px-6 py-4">URL</th>
                    <th className="px-6 py-4">Events</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                 {[1, 2].map((i) => (
                    <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                       <td className="px-6 py-4 font-mono text-neutral-900 dark:text-white">https://site.com/hooks/visa</td>
                       <td className="px-6 py-4 text-neutral-500">visa.*, user.created</td>
                       <td className="px-6 py-4"><Badge variant="success">Active</Badge></td>
                       <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm">
                             <MoreVertical className="w-4 h-4" />
                          </Button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
