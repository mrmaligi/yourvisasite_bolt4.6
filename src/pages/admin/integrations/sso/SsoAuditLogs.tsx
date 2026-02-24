import { IntegrationsLayout } from '../IntegrationsLayout';
import { Badge } from '../../../../components/ui/Badge';

export function SsoAuditLogs() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">SSO Audit Logs</h2>
           <p className="text-neutral-500">Track all SSO authentication events.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                 <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Time</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                 {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                       <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">user{i}@corp.com</td>
                       <td className="px-6 py-4 text-neutral-500">Okta</td>
                       <td className="px-6 py-4">Login</td>
                       <td className="px-6 py-4"><Badge variant="success">Success</Badge></td>
                       <td className="px-6 py-4 text-neutral-500">Oct 25, 14:0{i}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
