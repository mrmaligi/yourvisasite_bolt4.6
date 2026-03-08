import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  FileText,
  Bookmark,
  FolderOpen,
  Calendar,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

type ActivityType = 'purchase' | 'document' | 'booking';

interface ActivityItem {
  id: string;
  type: ActivityType;
  date: string;
  title: string;
  description: string;
  link: string;
}

export function DashboardV2() {
  const { profile } = useAuth();
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

        setActivities([
          {
            id: '1',
            type: 'purchase',
            date: '2 hours ago',
            title: 'Partner Visa Guide Purchased',
            description: 'Subclass 820/801 Premium Guide',
            link: '/my-visas'
          },
          {
            id: '2',
            type: 'document',
            date: '1 day ago',
            title: 'Document Uploaded',
            description: 'passport_scan.pdf',
            link: '/documents'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  const stats = [
    { name: 'Purchased Guides', count: counts.purchases, icon: FileText, href: '/my-visas', color: 'bg-blue-100 text-blue-600' },
    { name: 'Saved Visas', count: counts.saved, icon: Bookmark, href: '/saved-visas', color: 'bg-green-100 text-green-600' },
    { name: 'Documents', count: counts.documents, icon: FolderOpen, href: '/documents', color: 'bg-amber-100 text-amber-600' },
    { name: 'Upcoming Bookings', count: counts.upcomingBookings, icon: Calendar, href: '/consultations', color: 'bg-purple-100 text-purple-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
                <p className="text-slate-600">Here's what's happening with your visa journey</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Link
                key={stat.name}
                to={stat.href}
                className="bg-white border border-slate-200 p-6 hover:border-blue-400 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{stat.count}</p>
                  <p className="text-sm text-slate-600">{stat.name}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity - SQUARE */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                </div>
                
                <div className="divide-y divide-slate-200">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <Link
                        key={activity.id}
                        to={activity.link}
                        className="flex items-start gap-4 p-6 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-100 flex items-center justify-center flex-shrink-0">
                          {activity.type === 'purchase' && <FileText className="w-5 h-5 text-blue-600" />}
                          {activity.type === 'document' && <FolderOpen className="w-5 h-5 text-blue-600" />}
                          {activity.type === 'booking' && <Calendar className="w-5 h-5 text-blue-600" />}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900">{activity.title}</h3>
                          <p className="text-sm text-slate-600">{activity.description}</p>
                          <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
                        </div>
                        
                        <Badge variant="secondary">{activity.type}</Badge>
                      </Link>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      No recent activity. Start exploring visas!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions - SQUARE */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/visas">
                    <Button variant="primary" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Browse Visas
                    </Button>
                  </Link>
                  
                  <Link to="/lawyers">
                    <Button variant="outline" className="w-full">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Find a Lawyer
                    </Button>
                  </Link>
                  
                  <Link to="/documents">
                    <Button variant="outline" className="w-full">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Upload Documents
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-blue-600 text-white p-6">
                <h3 className="font-semibold mb-2">Need help?</h3>
                <p className="text-blue-100 text-sm mb-4">Get personalized guidance from our experts.</p>
                <Link to="/contact">
                  <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
