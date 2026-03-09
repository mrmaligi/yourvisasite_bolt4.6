import { Activity, Clock, UserPlus, FileText, AlertCircle } from 'lucide-react';

export function ActivityLogV2() {
  const activities = [
    { id: 1, user: 'John Doe', action: 'Created new visa application', time: '2 minutes ago', type: 'create' },
    { id: 2, user: 'Jane Smith', action: 'Updated blog post', time: '15 minutes ago', type: 'update' },
    { id: 3, user: 'System', action: 'Daily backup completed', time: '1 hour ago', type: 'system' },
    { id: 4, user: 'Bob Wilson', action: 'Deleted user account', time: '2 hours ago', type: 'delete' },
    { id: 5, user: 'Alice Brown', action: 'Published new article', time: '3 hours ago', type: 'create' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'create': return <UserPlus className="w-4 h-4 text-green-600" />;
      case 'update': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'delete': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
          <p className="text-slate-600">Track all system activities</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              Live updates
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-100 flex items-center justify-center">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-500">by {activity.user}</p>
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
