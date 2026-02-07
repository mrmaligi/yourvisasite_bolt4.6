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

export function LawyerDashboard() {
  const { profile } = useAuth();
  const [lawyerProfile, setLawyerProfile] = useState<LawyerProfileData | null>(null);
  const [counts, setCounts] = useState({ clients: 0, upcoming: 0, earnings: 0 });
  const [recentBookings, setRecentBookings] = useState<{
    id: string;
    status: string;
    notes: string | null;
    created_at: string;
  }[]>([]);

  useEffect(() => {
    if (!profile) return;
    supabase
      .schema('lawyer')
      .from('profiles')
      .select('id, is_verified, verification_status')
      .eq('profile_id', profile.id)
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
      .select('user_id, status, total_price_cents, created_at, notes')
      .eq('lawyer_id', lawyerProfileId);

    if (bookings) {
      const uniqueClients = new Set(bookings.map(b => b.user_id)).size;
      const upcoming = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
      const totalEarnings = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.total_price_cents, 0);

      setCounts({
        clients: uniqueClients,
        upcoming,
        earnings: Math.floor(totalEarnings / 100),
      });

      setRecentBookings(
        bookings
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(b => ({ id: b.created_at, status: b.status, notes: b.notes, created_at: b.created_at }))
      );
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

      {recentBookings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Recent Bookings</h2>
          <Card>
            <CardBody className="divide-y divide-neutral-100">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-neutral-900 text-sm capitalize">{booking.status}</p>
                      <span className="text-xs text-neutral-400 flex-shrink-0">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 truncate">
                      {booking.notes || 'Consultation session'}
                    </p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}