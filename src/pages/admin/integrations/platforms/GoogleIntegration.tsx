import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function GoogleIntegration() {
  return (
    <IntegrationsLayout>
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                   <span className="text-2xl font-bold text-blue-500">G</span>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Google Workspace</h1>
                   <p className="text-neutral-500">Sync calendar and drive files.</p>
                </div>
             </div>
             <Button>Connect Account</Button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
             <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">About this integration</h3>
             <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Connect your Google Workspace account to enable calendar syncing for consultations and document storage for visa applications.
             </p>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                   <span className="font-medium text-neutral-900 dark:text-white">Calendar Sync</span>
                   <div className="w-10 h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5"></div></div>
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                   <span className="font-medium text-neutral-900 dark:text-white">Drive Storage</span>
                   <div className="w-10 h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5"></div></div>
                </div>
             </div>
          </div>
       </div>
    </IntegrationsLayout>
  );
}
