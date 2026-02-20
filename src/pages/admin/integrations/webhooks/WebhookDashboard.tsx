import { IntegrationsLayout } from '../IntegrationsLayout';
import { Card, CardBody } from '../../../../components/ui/Card';
import { Webhook, CheckCircle, AlertTriangle } from 'lucide-react';

export function WebhookDashboard() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Webhooks Overview</h2>
           <p className="text-neutral-500">Monitor webhook delivery and health.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Webhook className="w-6 h-6 text-purple-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">12,450</h3>
                    <p className="text-sm text-neutral-500">Events Sent</p>
                 </div>
              </CardBody>
           </Card>
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">98.5%</h3>
                    <p className="text-sm text-neutral-500">Success Rate</p>
                 </div>
              </CardBody>
           </Card>
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">23</h3>
                    <p className="text-sm text-neutral-500">Failed Deliveries</p>
                 </div>
              </CardBody>
           </Card>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
           <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Recent Deliveries</h3>
           <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                    <div>
                       <p className="font-medium text-neutral-900 dark:text-white">visa.updated</p>
                       <p className="text-xs text-neutral-500">https://api.partner.com/webhooks</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">200 OK</span>
                        <span className="text-xs text-neutral-400">2s ago</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
