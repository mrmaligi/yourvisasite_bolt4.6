import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function OidcConfiguration() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">OIDC Configuration</h2>
           <p className="text-neutral-500">Setup OpenID Connect provider.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
           <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Client ID</label>
                 <input type="text" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
              </div>

              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Client Secret</label>
                 <input type="password" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
              </div>

              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Issuer URL</label>
                 <input type="url" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
              </div>
           </div>

           <div className="pt-4 flex justify-end">
              <Button>Save Configuration</Button>
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
