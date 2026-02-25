import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface ActivityItem {
  id: string;
  type: 'booking' | 'document' | 'purchase';
  date: string;
  title: string;
  description: string;
  link: string;
}

export function ActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchActivities = async () => {
      try {
        const [bookings, documents, purchases] = await Promise.all([
          supabase
            .from('bookings')
            .select('id, created_at, status')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('user_documents')
            .select('id, uploaded_at, file_name')
            .eq('user_id', user.id)
            .order('uploaded_at', { ascending: false })
            .limit(5),
          supabase
            .from('user_visa_purchases')
            .select('id, purchased_at, visas(name, subclass)')
            .eq('user_id', user.id)
            .order('purchased_at', { ascending: false })
            .limit(5),
        ]);

        const bookingItems: ActivityItem[] = (bookings.data || []).map((b: any) => ({
          id: b.id,
          type: 'booking',
          date: b.created_at,
          title: 'Consultation Booked',
          description: `Status: ${b.status}`,
          link: '/dashboard/consultations',
        }));

        const documentItems: ActivityItem[] = (documents.data || []).map((d: any) => ({
          id: d.id,
          type: 'document',
          date: d.uploaded_at,
          title: 'Document Uploaded',
          description: d.file_name,
          link: '/dashboard/documents',
        }));

        const purchaseItems: ActivityItem[] = (purchases.data || []).map((p: any) => ({
          id: p.id,
          type: 'purchase',
          date: p.purchased_at,
          title: 'Premium Guide Unlocked',
          description: `${p.visas?.subclass} - ${p.visas?.name}`,
          link: `/visas/${p.visas?.id}`, // Or relevant link
        }));

        const allActivities = [...bookingItems, ...documentItems, ...purchaseItems]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  return (
    <Card className="h-full border-blue-100 dark:border-blue-900">
      <CardHeader>
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Recent Activity</h2>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 bg-neutral-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50 text-blue-300" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((item) => (
              <Link key={`${item.type}-${item.id}`} to={item.link} className="flex gap-4 group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  item.type === 'booking' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' :
                  item.type === 'document' ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-200' :
                  'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                }`}>
                  {item.type === 'booking' && <Calendar className="w-5 h-5" />}
                  {item.type === 'document' && <FileText className="w-5 h-5" />}
                  {item.type === 'purchase' && <CheckCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0 pb-4 border-b border-neutral-100 last:border-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{item.description}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
