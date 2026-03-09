import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plug, CheckCircle, XCircle, Mail, CreditCard, Cloud } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: 'mail' | 'payment' | 'cloud';
  status: 'connected' | 'disconnected';
}

const MOCK_INTEGRATIONS: Integration[] = [
  { id: '1', name: 'SendGrid', description: 'Email delivery service', icon: 'mail', status: 'connected' },
  { id: '2', name: 'Stripe', description: 'Payment processing', icon: 'payment', status: 'connected' },
  { id: '3', name: 'AWS S3', description: 'File storage', icon: 'cloud', status: 'disconnected' },
];

export function IntegrationsV2() {
  const [integrations] = useState<Integration[]>(MOCK_INTEGRATIONS);

  const stats = {
    connected: integrations.filter(i => i.status === 'connected').length,
    disconnected: integrations.filter(i => i.status === 'disconnected').length,
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'mail': return <Mail className="w-6 h-6 text-blue-600" />;
      case 'payment': return <CreditCard className="w-6 h-6 text-purple-600" />;
      case 'cloud': return <Cloud className="w-6 h-6 text-orange-600" />;
      default: return <Plug className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Integrations | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
                <p className="text-slate-600">Manage third-party services</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.connected}</p>
                  <p className="text-sm text-slate-600">Connected</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.disconnected}</p>
                  <p className="text-sm text-slate-600">Disconnected</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                      {getIcon(integration.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{integration.name}</h3>
                      <p className="text-slate-600">{integration.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={integration.status === 'connected' ? 'success' : 'secondary'}>
                      {integration.status}
                    </Badge>
                    <Button variant={integration.status === 'connected' ? 'outline' : 'primary'} size="sm">
                      {integration.status === 'connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
