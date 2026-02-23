import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Bookmark,
  FolderOpen,
  Calendar,
  Search,
  Upload,
  UserCheck,
  ChevronRight,
  LayoutDashboard,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

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
  const { profile, signOut } = useAuth();
  const [counts, setCounts] = useState({
    purchases: 0,
    saved: 0,
    documents: 0,
    upcomingBookings: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      try {
        const [purchasesCount, savedCount, docsCount, bookingsCount] = await Promise.all([
          supabase.from('user_visa_purchases').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
          supabase.from('saved_visas').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
          supabase.from('user_documents').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
          supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('user_id', profile.id).in('status', ['pending', 'confirmed']),
        ]);

        setCounts({
          purchases: purchasesCount.count ?? 0,
          saved: savedCount.count ?? 0,
          documents: docsCount.count ?? 0,
          upcomingBookings: bookingsCount.count ?? 0,
        });

        const [recentPurchases, recentDocs, recentBookings] = await Promise.all([
          supabase.from('user_visa_purchases').select('id, purchased_at, visas(id, name, subclass_number)').eq('user_id', profile.id).order('purchased_at', { ascending: false }).limit(5),
          supabase.from('user_documents').select('id, file_name, uploaded_at').eq('user_id', profile.id).order('uploaded_at', { ascending: false }).limit(5),
          supabase.from('bookings').select('id, created_at, status').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(5)
        ]);

        const purchaseItems: ActivityItem[] = (recentPurchases.data || []).map((p: any) => ({
          id: p.id,
          type: 'purchase',
          date: p.purchased_at,
          title: 'Premium Guide Unlocked',
          description: `${p.visas?.subclass_number} - ${p.visas?.name}`,
          link: `/visas/${p.visas?.id}`
        }));

        const docItems: ActivityItem[] = (recentDocs.data || []).map((d: any) => ({
          id: d.id,
          type: 'document',
          date: d.uploaded_at,
          title: 'Document Uploaded',
          description: d.file_name,
          link: '/dashboard/documents'
        }));

        const bookingItems: ActivityItem[] = (recentBookings.data || []).map((b: any) => ({
          id: b.id,
          type: 'booking',
          date: b.created_at,
          title: 'Consultation Booked',
          description: `Status: ${b.status || 'pending'}`,
          link: '/dashboard/consultations'
        }));

        const allActivities = [...purchaseItems, ...docItems, ...bookingItems]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setActivities(allActivities);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  const statCards = [
    { label: 'Purchased Guides', value: counts.purchases, icon: FileText, to: '/dashboard/visas', color: 'text-navy-600', bg: 'bg-navy-50' },
    { label: 'Documents', value: counts.documents, icon: FolderOpen, to: '/dashboard/documents', color: 'text-gold-600', bg: 'bg-gold-50' },
    { label: 'Consultations', value: counts.upcomingBookings, icon: Calendar, to: '/dashboard/consultations', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Saved Visas', value: counts.saved, icon: Bookmark, to: '/dashboard/saved', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const sidebarItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', active: true },
    { to: '/dashboard/visas', icon: FileText, label: 'My Visas', active: false },
    { to: '/dashboard/documents', icon: FolderOpen, label: 'Documents', active: false },
    { to: '/dashboard/consultations', icon: Calendar, label: 'Consultations', active: false },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings', active: false },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardBody className="p-0">
                <div className="p-4 border-b border-neutral-200">
                  <p className="font-semibold text-navy-700 truncate">{profile?.full_name || 'User'}</p>
                  <p className="text-sm text-neutral-500 truncate">{profile?.email}</p>
                </div>
                
                <nav className="p-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${
                          item.active
                            ? 'bg-navy-50 text-navy-700 border-l-2 border-navy-600'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-navy-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="p-2 border-t border-neutral-200">
                  <button
                    onClick={signOut}
                    className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </CardBody>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-heading font-bold text-navy-700">
                Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
              </h1>
              <p className="text-neutral-600 mt-1">Here is an overview of your immigration journey.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <Link key={stat.label} to={stat.to}>
                  <Card hover className="h-full">
                    <CardBody className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-navy-700">{stat.value}</p>
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-bold text-navy-700">Recent Activity</h2>
                </div>
                
                {activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.map((item) => (
                      <Link key={`${item.type}-${item.id}`} to={item.link}>
                        <Card hover className="group">
                          <CardBody className="flex items-center gap-4 py-3">
                            <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0
                              ${item.type === 'purchase' ? 'bg-navy-100 text-navy-600' :
                                item.type === 'document' ? 'bg-gold-100 text-gold-600' :
                                'bg-green-100 text-green-600'}`}>
                              {item.type === 'purchase' && <FileText className="w-5 h-5" />}
                              {item.type === 'document' && <FolderOpen className="w-5 h-5" />}
                              {item.type === 'booking' && <Calendar className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-navy-700 group-hover:text-navy-800">
                                {item.title}
                              </p>
                              <p className="text-sm text-neutral-500 truncate">{item.description}</p>
                            </div>
                            <p className="text-xs text-neutral-400 flex-shrink-0">
                              {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                          </CardBody>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardBody className="text-center py-12">
                      <p className="text-neutral-500">No recent activity</p>
                      <Link to="/visas">
                        <Button variant="secondary" className="mt-4">
                          Explore Visas
                        </Button>
                      </Link>
                    </CardBody>
                  </Card>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-lg font-heading font-bold text-navy-700 mb-4">Quick Actions</h2>
                
                <Card>
                  <CardBody className="p-0">
                    <div className="divide-y divide-neutral-200">
                      <Link to="/visas" className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors">
                        <Search className="w-5 h-5 text-navy-600" />
                        <div>
                          <p className="font-medium text-navy-700">Search Visas</p>
                          <p className="text-xs text-neutral-500">Find the right visa</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto" />
                      </Link>
                      
                      <Link to="/dashboard/documents" className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors">
                        <Upload className="w-5 h-5 text-navy-600" />
                        <div>
                          <p className="font-medium text-navy-700">Upload Document</p>
                          <p className="text-xs text-neutral-500">Store your files</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto" />
                      </Link>
                      
                      <Link to="/lawyers" className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors">
                        <UserCheck className="w-5 h-5 text-navy-600" />
                        <div>
                          <p className="font-medium text-navy-700">Book Consultation</p>
                          <p className="text-xs text-neutral-500">Talk to an expert</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto" />
                      </Link>
                    </div>
                  </CardBody>
                </Card>

                {/* Info Box */}
                <div className="mt-4 bg-navy-50 border-l-4 border-navy-500 p-4">
                  <p className="text-sm text-navy-700">
                    <strong>Need help?</strong> Our support team is available 24/7 to assist you with your visa journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
