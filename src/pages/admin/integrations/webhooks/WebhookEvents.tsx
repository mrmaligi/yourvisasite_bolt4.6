import { IntegrationsLayout } from '../IntegrationsLayout';
import { Badge } from '../../../../components/ui/Badge';

export function WebhookEvents() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Event Catalog</h2>
           <p className="text-neutral-500">List of all available webhook events.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                 <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Payload Example</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-mono text-purple-600">user.created</td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">Triggered when a new user registers.</td>
                    <td className="px-6 py-4"><Badge variant="secondary">JSON</Badge></td>
                 </tr>
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-mono text-purple-600">visa.status_changed</td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">Triggered when a visa application changes status.</td>
                    <td className="px-6 py-4"><Badge variant="secondary">JSON</Badge></td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
