import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bell, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'push' | 'sms';
  sentAt: string;
  status: 'sent' | 'pending' | 'failed';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Welcome Email', message: 'New user onboarding', type: 'email', sentAt: '2024-03-20', status: 'sent' },
  { id: '2', title: 'Booking Reminder', message: 'Upcoming consultation', type: 'push', sentAt: '2024-03-19', status: 'sent' },
  { id: '3', title: 'Payment Alert', message: 'Failed payment', type: 'sms', sentAt: '2024-03-18', status: 'failed' },
];

export function NotificationsV2() {
  const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    failed: notifications.filter(n => n.status === 'failed').length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'push': return <Bell className="w-4 h-4 text-purple-600" />;
      case 'sms': return <MessageSquare className="w-4 h-4 text-green-600" />;
      default: return <Send className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Notifications | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                <p className="text-slate-600">Manage system notifications</p>
              </div>
              <Button variant="primary">
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Bell },
              { label: 'Sent', value: stats.sent, icon: CheckCircle, color: 'text-green-600' },
              { label: 'Failed', value: stats.failed, icon: Send, color: 'text-red-600' },
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

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Notification</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {notifications.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{n.title}</p>
                          <p className="text-sm text-slate-500">{n.message}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(n.type)}
                          <Badge variant="secondary">{n.type}</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={n.status === 'sent' ? 'success' : n.status === 'pending' ? 'warning' : 'danger'}>
                          {n.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{n.sentAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
