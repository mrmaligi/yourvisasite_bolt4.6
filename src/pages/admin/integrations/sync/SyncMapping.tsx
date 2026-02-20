import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function SyncMapping() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Field Mapping</h2>
           <p className="text-neutral-500">Map internal fields to external system fields.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
           <div className="grid grid-cols-3 gap-4 font-medium text-sm text-neutral-500 border-b border-neutral-100 dark:border-neutral-700 pb-2">
              <div>Internal Field</div>
              <div className="text-center">Direction</div>
              <div>External Field (Salesforce)</div>
           </div>

           <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                 <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 text-sm">user.email</div>
                 <div className="text-center text-neutral-400 text-xs">←→</div>
                 <input type="text" value="Contact.Email" className="p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                 <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 text-sm">user.full_name</div>
                 <div className="text-center text-neutral-400 text-xs">←→</div>
                 <input type="text" value="Contact.Name" className="p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                 <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 text-sm">visa.status</div>
                 <div className="text-center text-neutral-400 text-xs">→</div>
                 <input type="text" value="Opportunity.StageName" className="p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" />
              </div>
           </div>

           <div className="pt-4 flex justify-end">
              <Button>Save Mappings</Button>
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
