import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function HubSpotIntegration() {
  return (
    <IntegrationsLayout>
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                   <span className="text-2xl font-bold text-orange-500">HS</span>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">HubSpot</h1>
                   <p className="text-neutral-500">Marketing automation and CRM.</p>
                </div>
             </div>
             <Button>Connect HubSpot</Button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
             <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Marketing Contacts</h3>
             <p className="text-neutral-600 dark:text-neutral-400">Sync new user registrations to HubSpot contacts list.</p>
          </div>
       </div>
    </IntegrationsLayout>
  );
}
