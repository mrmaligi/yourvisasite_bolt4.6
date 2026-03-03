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
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

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
  const { toast } = useToast();
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
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch data from multiple tables
      const [
        recentUsers,
        recentLawyers,
        recentBookings,
        recentDocs,
        recentTrackers,
        todayUsers,
        pendingLawyers,
      ] = await Promise.all([
        supabase.from('profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('lawyer_profiles').select('id, user_id, bar_number, created_at, verification_status').order('created_at', { ascending: false }).limit(5),
        supabase.from('bookings').select('id, status, amount_cents, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('user_documents').select('id, file_name, uploaded_at').order('uploaded_at', { ascending: false }).limit(5),
        supabase.from('tracker_entries').select('id, outcome, processing_days, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
        supabase.from('lawyer_profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
      ]);

      const activityList: ActivityItem[] = [];

      // Add user signups
      recentUsers.data?.forEach(p => {
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

      // Add lawyer registrations
      recentLawyers.data?.forEach(l => {
        activityList.push({
          id: `lawyer-${l.id}`,
          type: 'lawyer_registration',
          title: 'Lawyer Registration',
          description: `Bar #${l.bar_number} - Status: ${l.verification_status}`,
          timestamp: l.created_at,
        });
      });

      // Add bookings
      recentBookings.data?.forEach(b => {
        activityList.push({
          id: `booking-${b.id}`,
          type: 'booking',
          title: 'New Consultation Booking',
          description: `Status: ${b.status}${b.amount_cents ? ` - $${b.amount_cents / 100}` : ''}`,
          timestamp: b.created_at,
        });
      });

      // Add documents
      recentDocs.data?.forEach(d => {
        activityList.push({
          id: `doc-${d.id}`,
          type: 'document',
          title: 'Document Uploaded',
          description: d.file_name || 'New document',
          timestamp: d.uploaded_at,
        });
      });

      // Add tracker entries
      recentTrackers.data?.forEach(t => {
        activityList.push({
          id: `tracker-${t.id}`,
          type: 'tracker',
          title: 'Tracker Entry Submitted',
          description: `Outcome: ${t.outcome}${t.processing_days ? ` - ${t.processing_days} days` : ''}`,
          timestamp: t.created_at,
        });
      });

      // Sort by timestamp
      activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(activityList.slice(0, 10));
      setStats({
        todaySignups: todayUsers.count || 0,
        weeklyPurchases: 0, // Would need marketplace_purchases data
        pendingVerifications: pendingLawyers.count || 0,
        totalRevenue: 0, // Would need to calculate from bookings
      });
    } catch (error) {
      console.error('Error fetching activity data:', error);
      toast('error', 'Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Activity Log</h1>
        <p className="text-neutral-500 mt-1">Recent activity across the platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.todaySignups}</p>
                <p className="text-sm text-neutral-500">Today's Signups</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.pendingVerifications}</p>
                <p className="text-sm text-neutral-500">Pending Verifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.weeklyPurchases}</p>
                <p className="text-sm text-neutral-500">Weekly Purchases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">${stats.totalRevenue}</p>
                <p className="text-sm text-neutral-500">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-1/4" />
                    <div className="h-3 bg-neutral-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type];
                const colorClass = activityColors[activity.type];

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-neutral-900 dark:text-white">{activity.title}</h3>
                        <span className="text-sm text-neutral-400">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">{activity.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
