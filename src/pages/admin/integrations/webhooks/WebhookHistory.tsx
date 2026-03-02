import { IntegrationsLayout } from '../IntegrationsLayout';
import { Badge } from '../../../../components/ui/Badge';

export function WebhookHistory() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Delivery History</h2>
           <p className="text-neutral-500">Log of all webhook attempts.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                 <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Endpoint</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Time</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                 {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                       <td className="px-6 py-4 font-mono text-neutral-500">evt_{i}23abc</td>
                       <td className="px-6 py-4 font-mono text-purple-600">visa.updated</td>
                       <td className="px-6 py-4 max-w-xs truncate text-neutral-500">https://api.partner.com/hooks...</td>
                       <td className="px-6 py-4">
                          <Badge variant={i === 3 ? 'danger' : 'success'}>
                             {i === 3 ? '500 Error' : '200 OK'}
                          </Badge>
                       </td>
                       <td className="px-6 py-4 text-neutral-500">2023-10-25 10:{30 + i}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
