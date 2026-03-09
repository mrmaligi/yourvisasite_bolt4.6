import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Activity, UserPlus, Scale, CreditCard, FileText, Clock, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

interface ActivityItem {
  id: string;
  type: 'user_signup' | 'lawyer_registration' | 'purchase' | 'booking' | 'document' | 'tracker';
  title: string;
  description: string;
  timestamp: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', type: 'user_signup', title: 'New User Signup', description: 'john@example.com registered', timestamp: '2024-03-20 10:30' },
  { id: '2', type: 'lawyer_registration', title: 'Lawyer Registration', description: 'Jane Doe applied as lawyer', timestamp: '2024-03-20 09:15' },
  { id: '3', type: 'purchase', title: 'New Purchase', description: 'Premium plan purchased', timestamp: '2024-03-20 08:45' },
  { id: '4', type: 'booking', title: 'Consultation Booked', description: 'Sarah Johnson booked with Michael Chen', timestamp: '2024-03-19 16:20' },
  { id: '5', type: 'document', title: 'Document Uploaded', description: 'Passport copy uploaded', timestamp: '2024-03-19 14:10' },
];

const activityIcons = {
  user_signup: UserPlus,
  lawyer_registration: Scale,
  purchase: CreditCard,
  booking: Clock,
  document: FileText,
  tracker: TrendingUp,
};

const activityColors = {
  user_signup: 'bg-blue-100 text-blue-600',
  lawyer_registration: 'bg-green-100 text-green-600',
  purchase: 'bg-amber-100 text-amber-600',
  booking: 'bg-purple-100 text-purple-600',
  document: 'bg-slate-100 text-slate-600',
  tracker: 'bg-teal-100 text-teal-600',
};

export function ActivityLogV2() {
  const [activities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);

  const stats = {
    todaySignups: 12,
    weeklyPurchases: 45,
    pendingVerifications: 8,
    totalRevenue: 12500,
  };

  return (
    <>
      <Helmet>
        <title>Activity Log | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
                <p className="text-slate-600">Monitor platform activity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Today's Signups", value: stats.todaySignups, icon: Users, color: 'bg-blue-100 text-blue-600' },
              { label: 'Weekly Purchases', value: stats.weeklyPurchases, icon: CreditCard, color: 'bg-green-100 text-green-600' },
              { label: 'Pending Verifications', value: stats.pendingVerifications, icon: Scale, color: 'bg-amber-100 text-amber-600' },
              { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
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
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            </div>
            
            <div className="divide-y divide-slate-200">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type];
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-slate-50">
                    <div className={`w-10 h-10 ${activityColors[activity.type]} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{activity.title}</p>
                      <p className="text-slate-600">{activity.description}</p>
                    </div>
                    
                    <span className="text-sm text-slate-500">{activity.timestamp}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
