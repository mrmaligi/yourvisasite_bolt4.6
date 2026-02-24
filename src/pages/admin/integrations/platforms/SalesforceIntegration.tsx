import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function SalesforceIntegration() {
  return (
    <IntegrationsLayout>
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                   <span className="text-2xl font-bold text-blue-400">SF</span>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Salesforce</h1>
                   <p className="text-neutral-500">CRM and customer data sync.</p>
                </div>
             </div>
             <Button>Connect Salesforce</Button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
             <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Sync Status</h3>
             <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-center text-neutral-500">
                Not connected. Click "Connect Salesforce" to start setup.
             </div>
          </div>
       </div>
    </IntegrationsLayout>
  );
}
