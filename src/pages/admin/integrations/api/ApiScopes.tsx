import { IntegrationsLayout } from '../IntegrationsLayout';
import { Badge } from '../../../../components/ui/Badge';

export function ApiScopes() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">OAuth Scopes</h2>
           <p className="text-neutral-500">Define available permissions for API tokens.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                 <tr>
                    <th className="px-6 py-4">Scope</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Access Level</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-mono text-purple-600">read:user</td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">Read user profile data</td>
                    <td className="px-6 py-4"><Badge variant="secondary">Read Only</Badge></td>
                 </tr>
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-mono text-purple-600">write:user</td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">Update user profile data</td>
                    <td className="px-6 py-4"><Badge variant="warning">Write</Badge></td>
                 </tr>
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-mono text-purple-600">read:visa</td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">View visa applications</td>
                    <td className="px-6 py-4"><Badge variant="secondary">Read Only</Badge></td>
                 </tr>
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-mono text-purple-600">admin:all</td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">Full administrative access</td>
                    <td className="px-6 py-4"><Badge variant="danger">Admin</Badge></td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
