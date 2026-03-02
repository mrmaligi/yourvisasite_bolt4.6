import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function StripeIntegration() {
  return (
    <IntegrationsLayout>
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                   <span className="text-2xl font-bold text-purple-600">S</span>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Stripe</h1>
                   <p className="text-neutral-500">Payment processing and subscriptions.</p>
                </div>
             </div>
             <Button variant="secondary" disabled>Connected</Button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
             <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Environment</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-neutral-600 dark:text-neutral-400">Mode</span>
                   <span className="font-mono text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Test Mode</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-neutral-600 dark:text-neutral-400">Publishable Key</span>
                   <span className="font-mono text-sm text-neutral-500">pk_test_...8923</span>
                </div>
             </div>
          </div>
       </div>
    </IntegrationsLayout>
  );
}
