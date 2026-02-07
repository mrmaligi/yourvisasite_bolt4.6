import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import type { Booking } from '../../types/database';

const statusVariant = {
  pending: 'warning' as const,
  confirmed: 'info' as const,
  completed: 'success' as const,
  cancelled: 'default' as const,
};

export function Consultations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setBookings(data || []);
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
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{b.duration_minutes} min consultation</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                    <span className="text-xs text-neutral-400">
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neutral-700">
                    ${(b.total_price_cents / 100).toFixed(0)}
                  </span>
                  {(b.status === 'pending' || b.status === 'confirmed') && (
                    <Button variant="secondary" size="sm" onClick={() => handleCancel(b.id)}>
                      Cancel
                    </Button>
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
