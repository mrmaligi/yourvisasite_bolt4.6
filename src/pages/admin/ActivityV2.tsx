import { Activity, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function AdminActivityV2() {
  const activities = [
    { id: 1, action: 'User login', user: 'john@example.com', ip: '192.168.1.1', time: '2 min ago' },
    { id: 2, action: 'Case created', user: 'jane@example.com', ip: '192.168.1.2', time: '5 min ago' },
    { id: 3, action: 'Document uploaded', user: 'bob@example.com', ip: '192.168.1.3', time: '12 min ago' },
    { id: 4, action: 'Payment processed', user: 'alice@example.com', ip: '192.168.1.4', time: '18 min ago' },
    { id: 5, action: 'Profile updated', user: 'john@example.com', ip: '192.168.1.1', time: '25 min ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Activity Log</h1>
          <p className="text-slate-400">Track system activity</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-slate-600" />
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-500">{activity.user} • {activity.ip}</p>
                </div>
                
                <span className="text-sm text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
