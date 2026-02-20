import { IntegrationsLayout } from '../IntegrationsLayout';
import { Card, CardBody } from '../../../../components/ui/Card';
import { Shield, Users, Lock } from 'lucide-react';

export function SsoDashboard() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">SSO Overview</h2>
           <p className="text-neutral-500">Manage enterprise authentication.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Shield className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">3</h3>
                    <p className="text-sm text-neutral-500">Active Providers</p>
                 </div>
              </CardBody>
           </Card>
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Users className="w-6 h-6 text-green-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">1,204</h3>
                    <p className="text-sm text-neutral-500">SSO Users</p>
                 </div>
              </CardBody>
           </Card>
           <Card>
              <CardBody className="flex items-center gap-4">
                 <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Lock className="w-6 h-6 text-purple-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Enforced</h3>
                    <p className="text-sm text-neutral-500">Security Policy</p>
                 </div>
              </CardBody>
           </Card>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
           <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Recent SSO Logins</h3>
           <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                    <div>
                       <p className="font-medium text-neutral-900 dark:text-white">user{i}@enterprise.com</p>
                       <p className="text-xs text-neutral-500">via Okta SAML</p>
                    </div>
                    <span className="text-xs text-neutral-400">10 mins ago</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
