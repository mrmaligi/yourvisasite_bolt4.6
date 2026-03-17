import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface Booking {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  lawyer: {
    full_name: string;
    avatar_url: string | null;
  };
}

export function ConsultationCalendar() {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            scheduled_at,
            duration_minutes,

            status,
            lawyer:profiles!lawyer_id(full_name, avatar_url)
          `)
          .eq('user_id', user.id)
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(3);

        if (error) throw error;

        // Transform the data to match our interface
        const transformedData: Booking[] = (data || []).map((item: any) => ({
          id: item.id,
          scheduled_at: item.scheduled_at,
          duration_minutes: item.duration_minutes,
          status: item.status,
          lawyer: {
            full_name: item.lawyer?.full_name || 'Lawyer',
            avatar_url: item.lawyer?.avatar_url || null,
          }
        }));

        setUpcomingBookings(transformedData);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <Card className="h-full border-blue-100 dark:border-blue-900">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Upcoming Consultations</h2>
        <Link to="/dashboard/consultations" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-neutral-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : upcomingBookings.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CalendarIcon className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-neutral-900 font-medium">No upcoming sessions</p>
            <p className="text-sm text-neutral-500 mb-4">Book a consultation with an expert today.</p>
            <Link to="/lawyers">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Find a Lawyer</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-200 overflow-hidden">
                    {booking.lawyer.avatar_url ? (
                      <img src={booking.lawyer.avatar_url} alt={booking.lawyer.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-xs font-bold text-blue-700">
                        {booking.lawyer.full_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900 dark:text-white">{booking.lawyer.full_name}</p>
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Video className="w-3 h-3" />
                      <span>Video Consultation</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300 pt-2 border-t border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{new Date(booking.scheduled_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(booking.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
