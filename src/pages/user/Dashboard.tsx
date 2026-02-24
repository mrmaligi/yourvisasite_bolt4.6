import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Bookmark,
  FolderOpen,
  Calendar,
  Search,
  Upload,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { useRealtime } from '../../hooks/useRealtime';

type ActivityType = 'purchase' | 'document' | 'booking';

interface ActivityItem {
  id: string;
  type: ActivityType;
  date: string;
  title: string;
  description: string;
  link: string;
}

export function UserDashboard() {
  const { profile } = useAuth();
  const [counts, setCounts] = useState({
    purchases: 0,
    saved: 0,
    documents: 0,
    upcomingBookings: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherActivities, setOtherActivities] = useState<ActivityItem[]>([]);
  const [initialBookings, setInitialBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      try {
        // Fetch counts
        const [purchasesCount, savedCount, docsCount] = await Promise.all([
          supabase.from('user_visa_purchases').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
          supabase.from('saved_visas').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
          supabase.from('user_documents').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
        ]);

        const { count: upcomingCount } = await supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', profile.id)
          .in('status', ['pending', 'confirmed']);

        setCounts({
          purchases: purchasesCount.count ?? 0,
          saved: savedCount.count ?? 0,
          documents: docsCount.count ?? 0,
          upcomingBookings: upcomingCount ?? 0,
        });

        // Fetch recent activity items
        const [recentPurchases, recentDocs, recentBookings] = await Promise.all([
          supabase
            .from('user_visa_purchases')
            .select('id, purchased_at, visas(id, name, subclass)')
            .eq('user_id', profile.id)
            .order('purchased_at', { ascending: false })
            .limit(5),
          supabase
            .from('user_documents')
            .select('id, file_name, uploaded_at')
            .eq('user_id', profile.id)
            .order('uploaded_at', { ascending: false })
            .limit(5),
          supabase
            .from('bookings')
            .select('id, created_at, status')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        const purchaseItems: ActivityItem[] = (recentPurchases.data || []).map((p: any) => ({
          id: p.id,
          type: 'purchase',
          date: p.purchased_at,
          title: 'Premium Guide Unlocked',
          description: `${p.visas?.subclass} - ${p.visas?.name}`,
          link: `/visas/${p.visas?.id}` // Or /dashboard/visas
        }));

        const docItems: ActivityItem[] = (recentDocs.data || []).map((d: any) => ({
          id: d.id,
          type: 'document',
          date: d.uploaded_at,
          title: 'Document Uploaded',
          description: d.file_name,
          link: '/dashboard/documents'
        }));

        setOtherActivities([...purchaseItems, ...docItems]);
        setInitialBookings(recentBookings.data || []);

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  // Realtime bookings
  const bookings = useRealtime('bookings', initialBookings, {
    filter: profile ? `user_id=eq.${profile.id}` : undefined,
    enabled: !!profile
  });

  useEffect(() => {
    if (loading) return;

    const bookingItems: ActivityItem[] = bookings.map((b: any) => ({
      id: b.id,
      type: 'booking',
      date: b.created_at,
      title: 'Consultation Booked',
      description: `Status: ${b.status || 'pending'}`,
      link: '/dashboard/consultations'
    }));

    const allActivities = [...otherActivities, ...bookingItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    setActivities(allActivities);
  }, [bookings, otherActivities, loading]);

  const statCards = [
    { label: 'Purchased Visas', value: counts.purchases, icon: FileText, to: '/dashboard/visas', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Documents', value: counts.documents, icon: FolderOpen, to: '/dashboard/documents', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Upcoming Consultations', value: counts.upcomingBookings, icon: Calendar, to: '/dashboard/consultations', color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Saved Visas', value: counts.saved, icon: Bookmark, to: '/dashboard/saved', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-neutral-500 mt-1">Here is an overview of your immigration journey.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <Card hover>
              <CardBody className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Activity</h2>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((item) => (
                <Link key={`${item.type}-${item.id}`} to={item.link}>
                  <Card hover className="group">
                    <CardBody className="flex items-center gap-4 py-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${item.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                          item.type === 'document' ? 'bg-purple-100 text-purple-600' :
                          'bg-teal-100 text-teal-600'}`}>
                        {item.type === 'purchase' && <FileText className="w-5 h-5" />}
                        {item.type === 'document' && <FolderOpen className="w-5 h-5" />}
                        {item.type === 'booking' && <Calendar className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">{item.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-neutral-400">
                          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-neutral-50 border-dashed">
              <CardBody className="text-center py-8">
                <p className="text-neutral-500">No recent activity</p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Quick Actions</h2>
          <Card>
            <CardBody className="space-y-3">
              <Link to="/visas" className="block">
                <Button variant="secondary" className="w-full justify-start gap-3 h-auto py-3">
                  <Search className="w-5 h-5 text-neutral-400" />
                  <div className="text-left">
                    <div className="font-medium text-neutral-900">Search Visas</div>
                    <div className="text-xs text-neutral-500 font-normal">Find the right visa for you</div>
                  </div>
                </Button>
              </Link>

              <Link to="/dashboard/documents" className="block">
                <Button variant="secondary" className="w-full justify-start gap-3 h-auto py-3">
                  <Upload className="w-5 h-5 text-neutral-400" />
                  <div className="text-left">
                    <div className="font-medium text-neutral-900">Upload Document</div>
                    <div className="text-xs text-neutral-500 font-normal">Securely store your files</div>
                  </div>
                </Button>
              </Link>

              <Link to="/lawyers" className="block">
                <Button variant="secondary" className="w-full justify-start gap-3 h-auto py-3">
                  <UserCheck className="w-5 h-5 text-neutral-400" />
                  <div className="text-left">
                    <div className="font-medium text-neutral-900">Book Consultation</div>
                    <div className="text-xs text-neutral-500 font-normal">Talk to an expert</div>
                  </div>
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
