import { useEffect, useState } from 'react';
import { Users, Calendar, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

interface ClientInfo {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  total_bookings: number;
  last_booking_date: string;
  total_spent_cents: number;
}

const statusVariant = {
  pending: 'warning' as const,
  confirmed: 'info' as const,
  completed: 'success' as const,
  cancelled: 'default' as const,
};

export function Clients() {
  const { profile } = useAuth();
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [recentBookings, setRecentBookings] = useState<{
    id: string;
    user_id: string;
    full_name: string | null;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes: string | null;
    created_at: string;
    total_price_cents: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lawyerProfileId, setLawyerProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    const fetchLawyerProfile = async () => {
      const { data } = await supabase
        .schema('lawyer')
        .from('profiles')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle();

      if (data) {
        setLawyerProfileId(data.id);
      }
    };

    fetchLawyerProfile();
  }, [profile]);

  useEffect(() => {
    if (!lawyerProfileId) return;

    const fetchClients = async () => {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('user_id, total_price_cents, status, created_at')
        .eq('lawyer_id', lawyerProfileId);

      if (!bookings || bookings.length === 0) {
        setLoading(false);
        return;
      }

      const userIds = [...new Set(bookings.map(b => b.user_id))];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const clientMap = new Map<string, ClientInfo>();
      bookings.forEach(b => {
        const existing = clientMap.get(b.user_id);
        const prof = profileMap.get(b.user_id);
        if (existing) {
          existing.total_bookings += 1;
          existing.total_spent_cents += b.total_price_cents;
          if (b.created_at > existing.last_booking_date) {
            existing.last_booking_date = b.created_at;
          }
        } else {
          clientMap.set(b.user_id, {
            user_id: b.user_id,
            full_name: prof?.full_name || null,
            phone: prof?.phone || null,
            total_bookings: 1,
            last_booking_date: b.created_at,
            total_spent_cents: b.total_price_cents,
          });
        }
      });

      setClients(Array.from(clientMap.values()).sort((a, b) =>
        new Date(b.last_booking_date).getTime() - new Date(a.last_booking_date).getTime()
      ));

      const { data: recent } = await supabase
        .from('bookings')
        .select('id, user_id, status, notes, created_at, total_price_cents')
        .eq('lawyer_id', lawyerProfileId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recent) {
        const recentWithNames = recent.map(r => ({
          ...r,
          full_name: profileMap.get(r.user_id)?.full_name || null,
        }));
        setRecentBookings(recentWithNames as typeof recentBookings);
      }

      setLoading(false);
    };

    fetchClients();
  }, [lawyerProfileId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Clients</h1>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Clients</h1>
        <p className="text-neutral-500 mt-1">View and manage your client relationships.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Client List</h2>
          {clients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No clients yet"
              description="Your clients will appear here once they book consultations with you."
            />
          ) : (
            <div className="space-y-3">
              {clients.map((client) => (
                <Card key={client.user_id}>
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary-700">
                          {client.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {client.full_name || 'Anonymous Client'}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {client.total_bookings} session{client.total_bookings !== 1 ? 's' : ''}
                          </span>
                          {client.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {client.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">
                        ${(client.total_spent_cents / 100).toFixed(0)}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Last: {new Date(client.last_booking_date).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <Card>
              <CardContent>
                <p className="text-sm text-neutral-500 text-center py-4">
                  No recent bookings
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-neutral-900 text-sm">
                        {booking.full_name || 'Anonymous'}
                      </p>
                      <Badge variant={statusVariant[booking.status]} className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-2">
                        {booking.notes}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                      <span>${(booking.total_price_cents / 100).toFixed(0)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
