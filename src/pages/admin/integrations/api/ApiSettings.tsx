import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function ApiSettings() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">General API Settings</h2>
           <p className="text-neutral-500">Configure global behavior for the API.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="font-medium text-neutral-900 dark:text-white">Enable API Access</h3>
                 <p className="text-sm text-neutral-500">Allow external requests to the API.</p>
              </div>
              <div className="w-12 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                 <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
           </div>

           <div className="flex items-center justify-between">
              <div>
                 <h3 className="font-medium text-neutral-900 dark:text-white">Log Request Bodies</h3>
                 <p className="text-sm text-neutral-500">Store full request payloads in logs (warning: may contain sensitive data).</p>
              </div>
              <div className="w-12 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full relative cursor-pointer">
                 <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
           </div>

           <div className="flex items-center justify-between">
              <div>
                 <h3 className="font-medium text-neutral-900 dark:text-white">Detailed Error Messages</h3>
                 <p className="text-sm text-neutral-500">Return stack traces in API errors (dev only).</p>
              </div>
              <div className="w-12 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full relative cursor-pointer">
                 <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
           </div>

           <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700 flex justify-end">
              <Button>Save Settings</Button>
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
