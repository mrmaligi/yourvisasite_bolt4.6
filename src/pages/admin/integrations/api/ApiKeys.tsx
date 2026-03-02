import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';
import { Plus, Trash, RefreshCw } from 'lucide-react';

export function ApiKeys() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">API Keys</h2>
             <p className="text-neutral-500">Manage API keys for external access.</p>
           </div>
           <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Key
           </Button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                 <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Prefix</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4">Last Used</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                 {[1, 2, 3].map((i) => (
                    <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                       <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">Production Key {i}</td>
                       <td className="px-6 py-4 font-mono text-neutral-500">pk_live_...{i}234</td>
                       <td className="px-6 py-4 text-neutral-500">Oct 24, 2023</td>
                       <td className="px-6 py-4 text-neutral-500">2 mins ago</td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <Button variant="ghost" size="sm">
                                <RefreshCw className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                <Trash className="w-4 h-4" />
                             </Button>
                          </div>
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
