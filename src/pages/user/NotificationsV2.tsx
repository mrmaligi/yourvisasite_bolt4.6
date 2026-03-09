import { Bell, CheckCircle, Clock, AlertCircle, FileText, User } from 'lucide-react';

export function NotificationsV2() {
  const notifications = [
    { id: 1, title: 'Document approved', message: 'Your passport has been verified', time: '2 hours ago', type: 'success', read: false },
    { id: 2, title: 'Consultation reminder', message: 'Meeting with Jane Smith tomorrow at 10 AM', time: '5 hours ago', type: 'reminder', read: false },
    { id: 3, title: 'Application update', message: 'Your visa application has been submitted', time: '1 day ago', type: 'info', read: true },
    { id: 4, title: 'Payment received', message: 'Thank you for your payment of $299', time: '2 days ago', type: 'success', read: true },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'reminder': return <Clock className="w-5 h-5 text-amber-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600">Stay updated on your applications</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 flex items-start gap-3 ${!notif.read ? 'bg-blue-50' : ''}`}>
                <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{notif.title}</p>
                    {!notif.read && <span className="w-2 h-2 bg-blue-600" />}
                  </div>
                  <p className="text-slate-600">{notif.message}</p>
                  <p className="text-sm text-slate-400 mt-1">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
