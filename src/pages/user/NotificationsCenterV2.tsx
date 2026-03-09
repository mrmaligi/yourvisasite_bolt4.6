import { Bell, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function NotificationsCenterV2() {
  const notifications = [
    { id: 1, title: 'Document Approved', message: 'Your passport copy has been verified', type: 'success', time: '2 min ago', read: false },
    { id: 2, title: 'Appointment Reminder', message: 'Consultation with Jane Smith in 1 hour', type: 'info', time: '1 hour ago', read: false },
    { id: 3, title: 'Payment Received', message: 'Your payment of $500 was processed', type: 'success', time: '2 hours ago', read: true },
    { id: 4, title: 'Action Required', message: 'Please upload your birth certificate', type: 'warning', time: '1 day ago', read: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="text-slate-400">Stay updated on your applications</p>
          </div>
          <Button variant="outline">Mark all as read</Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 flex items-start gap-4 ${!notif.read ? 'bg-blue-50' : ''}`}>
                <div className={`w-10 h-10 flex items-center justify-center ${
                  notif.type === 'success' ? 'bg-green-100' :
                  notif.type === 'warning' ? 'bg-amber-100' :
                  'bg-blue-100'
                }`}>
                  {notif.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                   notif.type === 'warning' ? <AlertCircle className="w-5 h-5 text-amber-600" /> :
                   <Bell className="w-5 h-5 text-blue-600" />}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{notif.title}</p>
                  <p className="text-sm text-slate-600">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                </div>
                
                <button className="p-2 text-slate-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
