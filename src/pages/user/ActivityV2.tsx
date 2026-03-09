import { Activity, FileText, CheckCircle, Clock, ChevronRight } from 'lucide-react';

export function UserActivityV2() {
  const activities = [
    { id: 1, action: 'Submitted visa application', item: 'Partner Visa (820)', date: '2024-03-20', status: 'completed' },
    { id: 2, action: 'Uploaded document', item: 'Passport scan', date: '2024-03-19', status: 'completed' },
    { id: 3, action: 'Booked consultation', item: 'With Jane Smith', date: '2024-03-18', status: 'upcoming' },
    { id: 4, action: 'Payment processed', item: '$299 for Premium Guide', date: '2024-03-15', status: 'completed' },
    { id: 5, action: 'Account created', item: 'Welcome to VisaBuild', date: '2024-03-10', status: 'completed' },
  ];

  const getIcon = (action: string) => {
    if (action.includes('visa')) return <FileText className="w-5 h-5 text-blue-600" />;
    if (action.includes('document')) return <FileText className="w-5 h-5 text-green-600" />;
    if (action.includes('payment')) return <Activity className="w-5 h-5 text-amber-600" />;
    return <CheckCircle className="w-5 h-5 text-slate-600" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
          <p className="text-slate-600">Track your recent activities</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                  {getIcon(activity.action)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-500">{activity.item}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">{activity.date}</p>
                  <span className={`text-xs px-2 py-0.5 ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
