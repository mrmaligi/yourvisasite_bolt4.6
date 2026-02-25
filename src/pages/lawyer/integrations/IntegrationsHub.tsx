import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchIntegrations = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', name: 'Google Calendar', description: 'Sync appointments and deadlines.', connected: true, icon: 'https://www.google.com/favicon.ico' },
    { id: '2', name: 'Stripe', description: 'Process payments securely.', connected: true, icon: 'https://stripe.com/favicon.ico' },
    { id: '3', name: 'Xero', description: 'Accounting and invoicing.', connected: false, icon: 'https://www.xero.com/favicon.ico' },
    { id: '4', name: 'Zoom', description: 'Video conferencing for consultations.', connected: false, icon: 'https://zoom.us/favicon.ico' },
  ];
};

export const IntegrationsHub = () => {
  const { data: integrations, isLoading } = useQuery({
    queryKey: ['lawyer-integrations'],
    queryFn: fetchIntegrations,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Integrations</h1>
          <p className="text-neutral-500 mt-1">Connect with your favorite tools</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations?.map((app) => (
          <Card key={app.id}>
            <CardBody className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-white rounded-lg border border-neutral-200 flex items-center justify-center p-2">
                  <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                </div>
                {app.connected ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                    Not Connected
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{app.name}</h3>
              <p className="text-sm text-neutral-500 mb-6 flex-1">{app.description}</p>

              <Button variant={app.connected ? 'secondary' : 'primary'} className="w-full">
                {app.connected ? 'Manage' : 'Connect'}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
