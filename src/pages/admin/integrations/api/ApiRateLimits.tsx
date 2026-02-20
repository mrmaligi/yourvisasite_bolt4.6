import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function ApiRateLimits() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Rate Limits</h2>
           <p className="text-neutral-500">Configure global and per-key rate limits.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
           <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Global Limit (requests per minute)</label>
                 <input type="number" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" defaultValue={1000} />
              </div>

              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Authenticated User Limit (requests per minute)</label>
                 <input type="number" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" defaultValue={60} />
              </div>

              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Anonymous Limit (requests per minute)</label>
                 <input type="number" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" defaultValue={10} />
              </div>
           </div>

           <div className="flex justify-end">
              <Button>Save Changes</Button>
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
