import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function SyncConflicts() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Sync Conflicts</h2>
           <p className="text-neutral-500">Resolve data discrepancies between systems.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                 <tr>
                    <th className="px-6 py-4">Record</th>
                    <th className="px-6 py-4">Field</th>
                    <th className="px-6 py-4">Internal Value</th>
                    <th className="px-6 py-4">External Value</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">User #1234</td>
                    <td className="px-6 py-4 text-neutral-500">Phone</td>
                    <td className="px-6 py-4 text-red-600">+1 555 0101</td>
                    <td className="px-6 py-4 text-green-600">+1 555 9999</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary">Keep Internal</Button>
                          <Button size="sm">Accept External</Button>
                       </div>
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
