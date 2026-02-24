import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function ZoomIntegration() {
  return (
    <IntegrationsLayout>
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                   <span className="text-2xl font-bold text-blue-500">Z</span>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Zoom</h1>
                   <p className="text-neutral-500">Video conferencing for consultations.</p>
                </div>
             </div>
             <Button>Connect Zoom</Button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
             <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Settings</h3>
             <p className="text-neutral-600 dark:text-neutral-400 mb-4">Automatically generate Zoom meeting links for new bookings.</p>
             <div className="flex items-center gap-2">
                 <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500" />
                 <label className="text-sm text-neutral-700 dark:text-neutral-300">Create meeting on booking confirmation</label>
             </div>
          </div>
       </div>
    </IntegrationsLayout>
  );
}
