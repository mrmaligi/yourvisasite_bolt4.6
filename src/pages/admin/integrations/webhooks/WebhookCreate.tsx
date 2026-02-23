import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function WebhookCreate() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Create Subscription</h2>
           <p className="text-neutral-500">Register a new webhook endpoint.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6 max-w-2xl">
           <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Endpoint URL</label>
              <input type="url" placeholder="https://api.example.com/webhooks" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
           </div>

           <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Events to Subscribe</label>
              <div className="space-y-2 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                 {['user.created', 'user.updated', 'visa.status_changed', 'payment.succeeded'].map((event) => (
                    <div key={event} className="flex items-center gap-2">
                       <input type="checkbox" id={event} className="rounded border-neutral-300 text-purple-600 focus:ring-purple-500" />
                       <label htmlFor={event} className="text-sm text-neutral-700 dark:text-neutral-300">{event}</label>
                    </div>
                 ))}
              </div>
           </div>

           <div className="pt-4 flex gap-3">
              <Button>Create Subscription</Button>
              <Button variant="secondary">Cancel</Button>
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
