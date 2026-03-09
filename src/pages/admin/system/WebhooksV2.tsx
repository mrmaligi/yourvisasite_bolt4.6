import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Webhook, Plus, CheckCircle, XCircle, Trash2, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  lastTriggered: string;
}

const MOCK_WEBHOOKS: WebhookConfig[] = [
  { id: '1', name: 'Booking Notifications', url: 'https://api.example.com/webhooks/bookings', events: ['booking.created', 'booking.updated'], status: 'active', lastTriggered: '2 min ago' },
  { id: '2', name: 'Payment Events', url: 'https://api.example.com/webhooks/payments', events: ['payment.success', 'payment.failed'], status: 'active', lastTriggered: '1 hour ago' },
  { id: '3', name: 'User Signups', url: 'https://api.example.com/webhooks/users', events: ['user.created'], status: 'inactive', lastTriggered: 'Never' },
];

export function WebhooksV2() {
  const [webhooks] = useState<WebhookConfig[]>(MOCK_WEBHOOKS);

  const stats = {
    total: webhooks.length,
    active: webhooks.filter(w => w.status === 'active').length,
    inactive: webhooks.filter(w => w.status === 'inactive').length,
  };

  return (
    <>
      <Helmet>
        <title>Webhooks | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Webhooks</h1>
                <p className="text-slate-600">Manage event-driven integrations</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Webhook },
              { label: 'Active', value: stats.active, icon: CheckCircle, color: 'text-green-600' },
              { label: 'Inactive', value: stats.inactive, icon: XCircle, color: 'text-slate-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">{webhook.name}</h3>
                      <Badge variant={webhook.status === 'active' ? 'success' : 'secondary'}>
                        {webhook.status}
                      </Badge>
                    </div>
                    
                    <code className="text-sm text-slate-600 bg-slate-100 px-2 py-1">{webhook.url}</code>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary">{event}</Badge>
                      ))}
                    </div>
                    
                    <p className="text-sm text-slate-500 mt-2">Last triggered: {webhook.lastTriggered}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm">
                      <Trash2 className="w-4 h-4" />
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
