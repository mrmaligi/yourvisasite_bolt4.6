import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function SyncSchedule() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Sync Schedule</h2>
           <p className="text-neutral-500">Configure frequency of data synchronization.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
           <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Frequency</label>
                 <select className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                    <option>Every 15 minutes</option>
                    <option>Hourly</option>
                    <option>Daily</option>
                    <option>Manual Only</option>
                 </select>
              </div>

              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Blackout Window</label>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="time" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
                    <input type="time" className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
                 </div>
                 <p className="text-xs text-neutral-500 mt-1">Do not run sync during these hours.</p>
              </div>
           </div>

           <div className="pt-4 flex justify-end">
              <Button>Update Schedule</Button>
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
