import { useEffect, useState } from 'react';
import { Calendar, Clock, User, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import type { Booking } from '../../types/database';

export function Bookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*, profiles:user_id(full_name, email), lawyer_profiles:lawyer_id(full_name)')
        .order('booking_date', { ascending: false });

      if (error) throw error;
      
      setBookings(data || []);
      setFilteredBookings(data || []);
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

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        (b.profiles?.full_name?.toLowerCase().includes(term)) ||
        (b.profiles?.email?.toLowerCase().includes(term)) ||
        (b.lawyer_profiles?.full_name?.toLowerCase().includes(term))
      );
    }
    
    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

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
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="primary">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Bookings</h1>
          <p className="text-neutral-500 mt-1">Manage consultation bookings</p>
        </div>
        <Button onClick={fetchBookings} variant="secondary">
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by client or lawyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: bookings.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-amber-50 text-amber-700' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-50 text-green-700' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-purple-50 text-purple-700' },
        ].map((stat) => (
          <Card key={stat.label} className={stat.color}>
            <CardBody className="text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-75">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">All Bookings</h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-neutral-500">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Lawyer</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Date & Time</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">
                              {booking.profiles?.full_name || 'Unknown'}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {booking.profiles?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-neutral-900">
                          {booking.lawyer_profiles?.full_name || 'Not assigned'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-neutral-900">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          {formatDate(booking.booking_date)}
                        </div>
                        <div className="flex items-center gap-2 text-neutral-500 text-sm mt-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => updateStatus(booking.id, 'confirmed')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateStatus(booking.id, 'cancelled')}
                              >
                                <XCircle className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => updateStatus(booking.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
