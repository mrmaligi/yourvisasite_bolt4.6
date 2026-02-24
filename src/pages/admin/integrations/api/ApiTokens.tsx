import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';
import { Plus } from 'lucide-react';

export function ApiTokens() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Personal Access Tokens</h2>
             <p className="text-neutral-500">Manage tokens for personal scripts and automation.</p>
           </div>
           <Button>
              <Plus className="w-4 h-4 mr-2" />
              Generate Token
           </Button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No Tokens Found</h3>
            <p className="text-neutral-500 mb-6">You haven't generated any personal access tokens yet.</p>
            <Button variant="secondary">Generate Your First Token</Button>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
