import { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SubscriptionStatus } from '../../components/SubscriptionStatus';

interface LawyerProfileData {
  id: string;
  is_verified: boolean;
  verification_status: string;
}

interface BookingWithDetails {
  id: string;
  status: string;
  created_at: string;
  start_time: string;
  user_name: string | null;
}

export function LawyerDashboard() {
  const { profile } = useAuth();
  const [lawyerProfile, setLawyerProfile] = useState<LawyerProfileData | null>(null);
  const [counts, setCounts] = useState({ clients: 0, upcoming: 0, earnings: 0 });
  const [upcomingConsultations, setUpcomingConsultations] = useState<BookingWithDetails[]>([]);

  useEffect(() => {
    if (!profile) return;
    supabase
      .schema('lawyer')
      .from('profiles')
      .select('id, is_verified, verification_status')
      .eq('user_id', profile.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setLawyerProfile(data);
          fetchStats(data.id);
        }
      });
  }, [profile]);

  const fetchStats = async (lawyerProfileId: string) => {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, user_id, slot_id, status, amount_cents, created_at')
      .eq('lawyer_id', lawyerProfileId);

    if (bookings && bookings.length > 0) {
      const uniqueClients = new Set(bookings.map(b => b.user_id)).size;

      const totalEarnings = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.amount_cents, 0);

      // Fetch slot details (start_time)
      const slotIds = bookings.map(b => b.slot_id);
      const { data: slots } = await supabase
        .schema('lawyer')
        .from('consultation_slots')
        .select('id, start_time')
        .in('id', slotIds);

      // Fetch user details
      const userIds = bookings.map(b => b.user_id);
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const slotMap = new Map(slots?.map(s => [s.id, s]));
      const userMap = new Map(users?.map(u => [u.id, u]));
      const now = new Date();

      const enrichedBookings = bookings.map(b => {
        const slot = slotMap.get(b.slot_id);
        const user = userMap.get(b.user_id);
        return {
          ...b,
          start_time: slot?.start_time || b.created_at, // Fallback if slot missing
          user_name: user?.full_name || 'Anonymous User',
        };
      });

      const upcoming = enrichedBookings.filter(b =>
        (b.status === 'pending' || b.status === 'confirmed') &&
        new Date(b.start_time) > now
      );

      setCounts({
        clients: uniqueClients,
        upcoming: upcoming.length,
        earnings: Math.floor(totalEarnings / 100),
      });

      setUpcomingConsultations(
        upcoming
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
          .slice(0, 5)
          .map(b => ({
            id: b.id,
            status: b.status,
            created_at: b.created_at,
            start_time: b.start_time,
            user_name: b.user_name
          }))
      );
    } else {
       setCounts({ clients: 0, upcoming: 0, earnings: 0 });
       setUpcomingConsultations([]);
    }
  };

  const statCards = [
    { label: 'Total Clients', value: counts.clients, icon: Users },
    { label: 'Upcoming Sessions', value: counts.upcoming, icon: Calendar },
    { label: 'Estimated Earnings', value: `$${counts.earnings}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Lawyer Dashboard</h1>
        <p className="text-neutral-500 mt-1">Manage your practice and clients.</p>
      </div>

      <SubscriptionStatus />

      {lawyerProfile && !lawyerProfile.is_verified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Verification {lawyerProfile.verification_status}</p>
            <p className="text-sm text-amber-700">
              Your account is pending admin verification. Some features are restricted until approval.
            </p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardBody className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {lawyerProfile?.is_verified && (
        <Badge variant="success">Verified Lawyer</Badge>
      )}

      {upcomingConsultations.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Upcoming Consultations</h2>
          <Card>
            <CardBody className="divide-y divide-neutral-100">
              {upcomingConsultations.map((booking) => (
                <div key={booking.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-neutral-900 text-sm">
                        {booking.user_name}
                      </p>
                      <span className="text-xs text-neutral-500 flex-shrink-0">
                        {new Date(booking.start_time).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                       <p className="text-sm text-neutral-500 truncate pr-2">
                        Consultation session
                      </p>
                       <Badge variant={booking.status === 'confirmed' ? 'info' : 'warning'} className="text-[10px] px-1.5 py-0.5 h-auto">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      ) : (
         <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Upcoming Consultations</h2>
          <Card>
            <CardBody>
               <p className="text-sm text-neutral-500 text-center py-4">
                  No upcoming consultations scheduled.
                </p>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
