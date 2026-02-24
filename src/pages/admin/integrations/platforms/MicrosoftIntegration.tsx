import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function MicrosoftIntegration() {
  return (
    <IntegrationsLayout>
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                   <span className="text-2xl font-bold text-blue-600">MS</span>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Microsoft 365</h1>
                   <p className="text-neutral-500">Outlook and OneDrive integration.</p>
                </div>
             </div>
             <Button>Connect Account</Button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
             <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Features</h3>
             <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                <li>Sync Outlook Calendar for lawyer availability.</li>
                <li>Store visa documents in OneDrive for Business.</li>
                <li>Single Sign-On with Azure AD.</li>
             </ul>
          </div>
       </div>
    </IntegrationsLayout>
  );
}
