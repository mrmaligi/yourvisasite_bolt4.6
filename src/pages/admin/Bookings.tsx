import { useEffect, useState } from 'react';
import { Calendar, Clock, User, Search, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import type { Booking } from '../../types/database';

interface BookingWithDetails extends Booking {
  client_name?: string;
  lawyer_name?: string;
}

export function Bookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch user and lawyer details
      const bookingsWithDetails = await Promise.all(
        (data || []).map(async (booking: Booking) => {
          let clientName = 'Unknown';
          let lawyerName = 'Not assigned';
          
          if (booking.user_id) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', booking.user_id)
              .single();
            clientName = userData?.full_name || userData?.email || 'Unknown';
          }
          
          if (booking.lawyer_id) {
            const { data: lawyerData } = await supabase
              .from('lawyer_profiles')
              .select('full_name')
              .eq('user_id', booking.lawyer_id)
              .single();
            lawyerName = lawyerData?.full_name || 'Not assigned';
          }
          
          return {
            ...booking,
            client_name: clientName,
            lawyer_name: lawyerName,
          };
        })
      );
      
      setBookings(bookingsWithDetails);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast('error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => 
    b.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.lawyer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      toast('success', `Booking ${newStatus}`);
      fetchBookings();
    } catch (error) {
      toast('error', 'Failed to update booking');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge variant="success">Confirmed</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelled</Badge>;
      case 'completed': return <Badge variant="primary">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDateTime = (scheduledAt: string) => {
    const date = new Date(scheduledAt);
    return {
      date: date.toLocaleDateString('en-AU', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Bookings</h1>
          <p className="text-neutral-500 mt-1">Manage consultation bookings</p>
        </div>
        <Button onClick={fetchBookings} variant="secondary">Refresh</Button>
      </div>

      <Input
        placeholder="Search by client or lawyer..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: bookings.length, color: 'bg-blue-50' },
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-amber-50' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-50' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-purple-50' },
        ].map((stat) => (
          <Card key={stat.label} className={stat.color}>
            <CardBody className="text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-75">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><h2 className="font-semibold">All Bookings</h2></CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4">Client</th>
                    <th className="text-left py-3 px-4">Lawyer</th>
                    <th className="text-left py-3 px-4">Date & Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBookings.map((booking) => {
                    const { date, time } = formatDateTime(booking.scheduled_at);
                    return (
                      <tr key={booking.id} className="hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary-600" />
                            </div>
                            <span>{booking.client_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{booking.lawyer_name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-neutral-400" />
                            {date}
                          </div>
                          <div className="flex items-center gap-2 text-neutral-500 text-sm mt-1">
                            <Clock className="w-4 h-4" />
                            {time} ({booking.duration_minutes} min)
                          </div>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(booking.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button size="sm" variant="secondary" onClick={() => updateStatus(booking.id, 'confirmed')}>
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => updateStatus(booking.id, 'cancelled')}>
                                  <XCircle className="w-4 h-4 text-red-500" />
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button size="sm" variant="secondary" onClick={() => updateStatus(booking.id, 'completed')}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
