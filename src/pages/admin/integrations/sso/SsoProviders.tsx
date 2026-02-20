import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';
import { Plus, Settings } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';

export function SsoProviders() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Identity Providers</h2>
             <p className="text-neutral-500">Configure connection to IdPs.</p>
           </div>
           <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
           </Button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                 <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Protocol</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">Okta (Employees)</td>
                    <td className="px-6 py-4 text-neutral-500">SAML 2.0</td>
                    <td className="px-6 py-4"><Badge variant="success">Active</Badge></td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                       </Button>
                    </td>
                 </tr>
                 <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">Google Workspace</td>
                    <td className="px-6 py-4 text-neutral-500">OIDC</td>
                    <td className="px-6 py-4"><Badge variant="success">Active</Badge></td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                       </Button>
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
