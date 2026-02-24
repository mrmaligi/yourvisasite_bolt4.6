import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function ZapierIntegration() {
  return (
    <IntegrationsLayout>
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                   <span className="text-2xl font-bold text-orange-600">Z</span>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Zapier</h1>
                   <p className="text-neutral-500">Automate workflows with 5000+ apps.</p>
                </div>
             </div>
             <Button>View Zaps</Button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
             <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">API Key</h3>
             <p className="text-neutral-600 dark:text-neutral-400 mb-4">Use this key to authenticate VisaBuild in Zapier.</p>
             <input type="text" readOnly value="zap_key_89234jkdfs908234" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-600" />
          </div>
       </div>
    </IntegrationsLayout>
  );
}
