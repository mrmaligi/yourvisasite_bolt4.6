import { IntegrationsLayout } from '../IntegrationsLayout';
import { Button } from '../../../../components/ui/Button';

export function WebhookSecurity() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Webhook Security</h2>
           <p className="text-neutral-500">Manage signing secrets and verification.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
           <div>
              <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Signing Secret</h3>
              <p className="text-sm text-neutral-500 mb-4">Use this secret to verify signatures on incoming webhook requests.</p>

              <div className="flex gap-2">
                 <input type="text" readOnly value="whsec_kfjsd8342398fdsf89234" className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-600" />
                 <Button variant="secondary">Copy</Button>
                 <Button variant="danger">Roll Key</Button>
              </div>
           </div>

           <div className="pt-6 border-t border-neutral-100 dark:border-neutral-700">
               <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Verification Example (Node.js)</h3>
               <pre className="p-4 bg-neutral-900 text-neutral-200 rounded-lg text-sm overflow-x-auto">
{`const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}`}
               </pre>
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
