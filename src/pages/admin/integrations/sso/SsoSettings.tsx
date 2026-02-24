import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function SsoSettings() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">SSO Settings</h2>
           <p className="text-neutral-500">Configure global SSO policies.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="font-medium text-neutral-900 dark:text-white">Enforce SSO</h3>
                 <p className="text-sm text-neutral-500">Require all users with corporate email domains to use SSO.</p>
              </div>
              <div className="w-12 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                 <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
           </div>

           <div className="flex items-center justify-between">
              <div>
                 <h3 className="font-medium text-neutral-900 dark:text-white">Allow Password Fallback</h3>
                 <p className="text-sm text-neutral-500">Allow users to login with password if SSO fails.</p>
              </div>
              <div className="w-12 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full relative cursor-pointer">
                 <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
           </div>

           <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700 flex justify-end">
              <Button>Update Policy</Button>
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
