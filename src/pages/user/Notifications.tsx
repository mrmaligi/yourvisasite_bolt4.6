import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bell, Info, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const mockNotifications = [
  { id: 1, title: 'Document Approved', message: 'Your police check has been verified.', type: 'success', date: '2 hours ago', read: false },
  { id: 2, title: 'New Message', message: 'Lawyer Sarah Johnson sent you a message.', type: 'info', date: '1 day ago', read: false },
  { id: 3, title: 'Visa Update', message: 'Processing times for subclass 189 have changed.', type: 'warning', date: '3 days ago', read: true },
  { id: 4, title: 'Welcome to VisaBuild', message: 'Get started by completing your profile.', type: 'info', date: '1 week ago', read: true },
];

export function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Notifications | VisaBuild</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notifications</h1>
          <p className="text-neutral-500 mt-1">Stay updated with your application progress.</p>
        </div>
        <div className="flex gap-2">
           <Button
             variant="ghost"
             onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
             className="gap-2"
           >
             <Filter className="w-4 h-4" />
             {filter === 'all' ? 'Show Unread' : 'Show All'}
           </Button>
           <Button variant="secondary" onClick={markAllRead}>
             Mark all as read
           </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 bg-neutral-50 rounded-2xl">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border transition-colors flex gap-4 ${
                notification.read
                  ? 'bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700'
                  : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notification.type === 'success' ? 'bg-green-100 text-green-600' :
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {notification.type === 'info' && <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${notification.read ? 'text-neutral-900 dark:text-white' : 'text-neutral-900 dark:text-white font-bold'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-neutral-500">{notification.date}</span>
                </div>
                <p className={`text-sm mt-1 ${notification.read ? 'text-neutral-600 dark:text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                  {notification.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
