import { useEffect, useState } from 'react';
import {
  Activity,
  UserPlus,
  Scale,
  CreditCard,
  FileText,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader } from '../../components/ui/card';

interface ActivityItem {
  id: string;
  type: 'user_signup' | 'lawyer_registration' | 'purchase' | 'booking' | 'document' | 'tracker';
  title: string;
  description: string;
  timestamp: string;
}

const activityIcons = {
  user_signup: UserPlus,
  lawyer_registration: Scale,
  purchase: CreditCard,
  booking: Clock,
  document: FileText,
  tracker: TrendingUp,
};

const activityColors = {
  user_signup: 'bg-sky-50 text-sky-600',
  lawyer_registration: 'bg-emerald-50 text-emerald-600',
  purchase: 'bg-amber-50 text-amber-600',
  booking: 'bg-primary-50 text-primary-600',
  document: 'bg-neutral-100 text-neutral-600',
  tracker: 'bg-teal-50 text-teal-600',
};

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({
    todaySignups: 0,
    weeklyPurchases: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      recentProfiles,
      recentLawyers,
      recentPurchases,
      recentBookings,
      recentDocs,
      recentTrackers,
      todayUsers,
      weekPurchases,
      pendingLawyers,
    ] = await Promise.all([
      supabase.from('profiles').select('id, full_name, created_at, role').order('created_at', { ascending: false }).limit(5),
      supabase.schema('lawyer').from('profiles').select('id, user_id, jurisdiction, created_at, verification_status').order('created_at', { ascending: false }).limit(5),
      supabase.from('user_visa_purchases').select('id, amount_cents, purchased_at').order('purchased_at', { ascending: false }).limit(5),
      supabase.from('bookings').select('id, status, amount_cents, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('user_documents').select('id, file_name, uploaded_at').order('uploaded_at', { ascending: false }).limit(5),
      supabase.from('tracker_entries').select('id, outcome, processing_days, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('user_visa_purchases').select('id, amount_cents').gte('purchased_at', weekStart),
      supabase.schema('lawyer').from('profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    ]);

    const activityList: ActivityItem[] = [];

    recentProfiles.data?.forEach(p => {
      if (p.role === 'user') {
        activityList.push({
          id: `user-${p.id}`,
          type: 'user_signup',
          title: 'New User Signup',
          description: p.full_name || 'Anonymous user registered',
          timestamp: p.created_at,
        });
      }
    });

    recentLawyers.data?.forEach(l => {
      activityList.push({
        id: `lawyer-${l.id}`,
        type: 'lawyer_registration',
        title: l.verification_status === 'pending' ? 'Lawyer Pending Verification' : 'Lawyer Registration',
        description: `${l.jurisdiction} - ${l.verification_status}`,
        timestamp: l.created_at,
      });
    });

    recentPurchases.data?.forEach(p => {
      activityList.push({
        id: `purchase-${p.id}`,
        type: 'purchase',
        title: 'Visa Guide Purchase',
        description: `$${(p.amount_cents / 100).toFixed(0)} purchase`,
        timestamp: p.purchased_at,
      });
    });

    recentBookings.data?.forEach(b => {
      activityList.push({
        id: `booking-${b.id}`,
        type: 'booking',
        title: 'Consultation Booking',
        description: `${b.status} - $${(b.amount_cents / 100).toFixed(0)}`,
        timestamp: b.created_at,
      });
    });

    recentDocs.data?.forEach(d => {
      activityList.push({
        id: `doc-${d.id}`,
        type: 'document',
        title: 'Document Uploaded',
        description: d.file_name,
        timestamp: d.uploaded_at,
      });
    });

    recentTrackers.data?.forEach(t => {
      activityList.push({
        id: `tracker-${t.id}`,
        type: 'tracker',
        title: 'Tracker Entry',
        description: `${t.outcome} - ${t.processing_days} days`,
        timestamp: t.created_at,
      });
    });

    activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setActivities(activityList.slice(0, 20));

    const totalWeeklyRevenue = (weekPurchases.data || []).reduce((sum, p) => sum + p.amount_cents, 0);

    setStats({
      todaySignups: todayUsers.count || 0,
      weeklyPurchases: weekPurchases.data?.length || 0,
      pendingVerifications: pendingLawyers.count || 0,
      totalRevenue: Math.floor(totalWeeklyRevenue / 100),
    });

    setLoading(false);
  };

  const statCards = [
    { label: "Today's Signups", value: stats.todaySignups, icon: Users, color: 'bg-sky-50 text-sky-600' },
    { label: 'Weekly Purchases', value: stats.weeklyPurchases, icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: Scale, color: 'bg-amber-50 text-amber-600' },
    { label: 'Weekly Revenue', value: `$${stats.totalRevenue}`, icon: DollarSign, color: 'bg-primary-50 text-primary-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Activity Log</h1>
        <div className="animate-pulse space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Activity Log</h1>
        <p className="text-neutral-500 mt-1">Real-time platform activity and metrics.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-neutral-900">Recent Activity</h2>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-100">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];
              return (
                <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-neutral-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-neutral-900">{activity.title}</p>
                      <span className="text-xs text-neutral-400 flex-shrink-0">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 truncate">{activity.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
