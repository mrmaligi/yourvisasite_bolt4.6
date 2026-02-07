import { useEffect, useState } from 'react';
import { Calendar, Clock, Scale } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import type { Booking } from '../../types/database';

interface BookingWithDetails extends Booking {
  lawyer_name?: string;
  lawyer_jurisdiction?: string;
  slot_time?: string;
}

const statusVariant = {
  pending: 'warning' as const,
  confirmed: 'info' as const,
  completed: 'success' as const,
  cancelled: 'default' as const,
};

export function Consultations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;

    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!bookingsData || bookingsData.length === 0) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const lawyerIds = [...new Set(bookingsData.map(b => b.lawyer_id))];
    const slotIds = [...new Set(bookingsData.map(b => b.slot_id).filter(Boolean))];

    const { data: lawyerProfiles } = await supabase
      .schema('lawyer')
      .from('profiles')
      .select('id, profile_id, jurisdiction')
      .in('id', lawyerIds);

    const profileIds = lawyerProfiles?.map(lp => lp.profile_id) || [];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', profileIds);

    const { data: slots } = await supabase
      .schema('lawyer')
      .from('consultation_slots')
      .select('id, start_time')
      .in('id', slotIds);

    const lawyerMap = new Map(lawyerProfiles?.map(lp => {
      const profile = profiles?.find(p => p.id === lp.profile_id);
      return [lp.id, { name: profile?.full_name, jurisdiction: lp.jurisdiction }];
    }) || []);

    const slotMap = new Map(slots?.map(s => [s.id, s.start_time]) || []);

    const enrichedBookings = bookingsData.map(b => ({
      ...b,
      lawyer_name: lawyerMap.get(b.lawyer_id)?.name || 'Unknown Lawyer',
      lawyer_jurisdiction: lawyerMap.get(b.lawyer_id)?.jurisdiction || '',
      slot_time: slotMap.get(b.slot_id) || undefined,
    }));

    setBookings(enrichedBookings);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const handleCancel = async (id: string) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    toast('success', 'Consultation cancelled');
    fetchBookings();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Consultations</h1>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-neutral-200 rounded-xl" />)}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No consultations"
          description="Book a consultation with a verified immigration lawyer from a visa detail page."
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardBody className="p-0">
                <div className="p-4 border-b border-neutral-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Scale className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{b.lawyer_name}</p>
                        <p className="text-sm text-neutral-500">{b.lawyer_jurisdiction}</p>
                      </div>
                    </div>
                    <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                  </div>
                </div>
                <div className="p-4 bg-neutral-50">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <Clock className="w-4 h-4" />
                      <span>{b.duration_minutes} minutes</span>
                    </div>
                    {b.slot_time && (
                      <div className="flex items-center gap-1.5 text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(b.slot_time).toLocaleDateString()} at {new Date(b.slot_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                    <span className="font-semibold text-neutral-900">
                      ${(b.total_price_cents / 100).toFixed(0)}
                    </span>
                  </div>
                  {b.notes && (
                    <p className="mt-3 text-sm text-neutral-500 bg-white p-3 rounded-lg border border-neutral-200">
                      {b.notes}
                    </p>
                  )}
                  {(b.status === 'pending' || b.status === 'confirmed') && (
                    <div className="mt-3 flex justify-end">
                      <Button variant="secondary" size="sm" onClick={() => handleCancel(b.id)}>
                        Cancel Consultation
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
