import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function SlackIntegration() {
  return (
    <IntegrationsLayout>
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                   <span className="text-2xl font-bold text-purple-600">S</span>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Slack</h1>
                   <p className="text-neutral-500">Real-time notifications and alerts.</p>
                </div>
             </div>
             <Button>Add to Slack</Button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
             <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Notification Channels</h3>
             <div className="space-y-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                   <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">New User Signups</label>
                   <input type="text" placeholder="#new-users" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                   <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Critical Errors</label>
                   <input type="text" placeholder="#alerts" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
                </div>
             </div>
          </div>
       </div>
    </IntegrationsLayout>
  );
}
