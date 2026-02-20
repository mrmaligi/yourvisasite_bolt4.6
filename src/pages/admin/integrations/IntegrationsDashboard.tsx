import { Link } from 'react-router-dom';
import { IntegrationsLayout } from './IntegrationsLayout';
import { Card, CardBody } from '../../../components/ui/Card';
import { Blocks, Key, Globe, Shield, Database, Webhook } from 'lucide-react';

export function IntegrationsDashboard() {
  const stats = [
    { label: 'Active Integrations', value: '12', icon: Blocks, color: 'blue' },
    { label: 'API Keys', value: '5', icon: Key, color: 'green' },
    { label: 'Webhooks', value: '8', icon: Webhook, color: 'purple' },
    { label: 'SSO Providers', value: '3', icon: Shield, color: 'orange' },
  ];

  return (
    <IntegrationsLayout>
       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
          };
          return (
            <Card key={stat.label}>
              <CardBody className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
       </div>

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/integrations/platforms/google">
            <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
               <CardBody className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                     <Globe className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">Platforms</h3>
                  <p className="text-sm text-neutral-500">Manage connections with Google, Slack, Zoom, etc.</p>
               </CardBody>
            </Card>
          </Link>

          <Link to="/admin/integrations/api">
             <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
               <CardBody className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                     <Key className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">API Management</h3>
                  <p className="text-sm text-neutral-500">Configure API keys, rate limits, and scopes.</p>
               </CardBody>
            </Card>
          </Link>

          <Link to="/admin/integrations/webhooks">
             <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
               <CardBody className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                     <Webhook className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">Webhooks</h3>
                  <p className="text-sm text-neutral-500">Manage event subscriptions and delivery logs.</p>
               </CardBody>
            </Card>
          </Link>

           <Link to="/admin/integrations/sso">
             <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
               <CardBody className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                     <Shield className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">SSO</h3>
                  <p className="text-sm text-neutral-500">Configure SAML, OIDC, and enterprise login.</p>
               </CardBody>
            </Card>
          </Link>

           <Link to="/admin/integrations/sync">
             <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
               <CardBody className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                     <Database className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">Data Sync</h3>
                  <p className="text-sm text-neutral-500">Manage data synchronization schedules and conflicts.</p>
               </CardBody>
            </Card>
          </Link>
       </div>
    </IntegrationsLayout>
  );
}
