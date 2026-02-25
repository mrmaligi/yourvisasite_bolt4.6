import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';

const mockNotifications = [
  { id: 1, title: 'Visa Update', message: 'New processing times released for Subclass 189.', time: '2h ago', read: false },
  { id: 2, title: 'Document Verified', message: 'Your passport has been verified.', time: '1d ago', read: true },
  { id: 3, title: 'Consultation Reminder', message: 'Upcoming consultation with Sarah Mitchell.', time: '2d ago', read: true },
];

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="h-full border-blue-100 dark:border-blue-900">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-lg border transition-colors ${
                n.read
                  ? 'bg-neutral-50 border-transparent text-neutral-500'
                  : 'bg-blue-50 border-blue-100 text-blue-900'
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-sm">{n.title}</h3>
                <span className="text-xs opacity-70">{n.time}</span>
              </div>
              <p className="text-xs">{n.message}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
