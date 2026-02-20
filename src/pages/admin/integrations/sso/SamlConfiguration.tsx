import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function SamlConfiguration() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">SAML 2.0 Configuration</h2>
           <p className="text-neutral-500">Setup generic SAML provider.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
           <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">IdP Entity ID</label>
                 <input type="text" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
              </div>

              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">SSO URL (ACS)</label>
                 <input type="url" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
              </div>

              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Public Certificate (X.509)</label>
                 <textarea className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 h-32 font-mono text-xs"></textarea>
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
