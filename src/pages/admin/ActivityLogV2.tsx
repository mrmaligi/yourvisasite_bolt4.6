import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Activity,
  UserPlus,
  Scale,
  CreditCard,
  FileText,
  Clock,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const MOCK_ACTIVITIES = [
  { id: '1', type: 'user_signup', title: 'New user registered', description: 'john@example.com signed up', timestamp: '2 min ago' },
  { id: '2', type: 'lawyer_registration', title: 'Lawyer application', description: 'Sarah Wilson applied', timestamp: '15 min ago' },
  { id: '3', type: 'purchase', title: 'Premium purchase', description: 'Partner Visa Guide - $99', timestamp: '1 hour ago' },
  { id: '4', type: 'booking', title: 'Consultation booked', description: 'With Michael Chen', timestamp: '2 hours ago' },
  { id: '5', type: 'document', title: 'Document uploaded', description: 'Passport copy uploaded', timestamp: '3 hours ago' },
];

const activityIcons: Record<string, any> = {
  user_signup: UserPlus,
  lawyer_registration: Scale,
  purchase: CreditCard,
  booking: Clock,
  document: FileText,
};

const activityColors: Record<string, string> = {
  user_signup: 'bg-blue-100 text-blue-600',
  lawyer_registration: 'bg-green-100 text-green-600',
  purchase: 'bg-amber-100 text-amber-600',
  booking: 'bg-purple-100 text-purple-600',
  document: 'bg-slate-100 text-slate-600',
};

export function ActivityLogV2() {
  const [activities] = useState(MOCK_ACTIVITIES);

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
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
                <p className="text-slate-600">Recent platform activity</p>
              </div>
              <Badge variant="primary">Live</Badge>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Today's Signups", value: stats.todaySignups, icon: UserPlus },
              { label: 'Weekly Purchases', value: stats.weeklyPurchases, icon: CreditCard },
              { label: 'Pending Verifications', value: stats.pendingVerifications, icon: Scale },
              { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: Activity },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Activity List - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            </div>
            
            <div className="divide-y divide-slate-200">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type] || Activity;
                return (
                  <div key={activity.id} className="p-6 flex items-start gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center ${activityColors[activity.type] || 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{activity.title}</p>
                      <p className="text-slate-600">{activity.description}</p>
                      <p className="text-sm text-slate-500 mt-1">{activity.timestamp}</p>
                    </div>
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
