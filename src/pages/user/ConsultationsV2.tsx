import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Calendar, History, Video, X, Clock, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { useBookings } from '../../hooks/useBookings';

export function ConsultationsV2() {
  const navigate = useNavigate();
  const { bookings, loading, refetch } = useBookings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const handleCancel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      toast('success', 'Consultation cancelled');
      refetch();
    } catch (error) {
      toast('error', 'Failed to cancel consultation');
    }
  };

  const handleReschedule = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      navigate(`/dashboard/book-consultation/${booking.lawyer_id}?reschedule=${id}`);
    } else {
      toast('error', 'Booking not found');
    }
  };

  const handleJoin = (id: string) => {
    navigate(`/consultation-room/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading consultations...</div>
      </div>
    );
  }

  const now = new Date();
  const upcomingBookings = bookings.filter(b => {
    const time = new Date(b.scheduled_at);
    return time > now && b.status !== 'cancelled';
  });

  const pastBookings = bookings.filter(b => {
    const time = new Date(b.scheduled_at);
    return time <= now || b.status === 'cancelled';
  });

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <>
      <Helmet>
        <title>My Consultations | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Consultations</h1>
                <p className="text-slate-600">Manage your appointments with immigration lawyers</p>
              </div>
              
              <Button variant="primary" onClick={() => navigate('/lawyers')}>
                <Calendar className="w-4 h-4 mr-2" />
                Book New Consultation
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs - SQUARE */}
          <div className="flex gap-0 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming ({upcomingBookings.length})
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Past ({pastBookings.length})
              </div>
            </button>
          </div>

          {/* Bookings List - SQUARE */}
          <div className="space-y-4">
            {displayBookings.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 text-center">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {activeTab === 'upcoming' ? 'No upcoming consultations' : 'No past consultations'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {activeTab === 'upcoming' 
                    ? 'Book a consultation with an immigration lawyer to get started.'
                    : 'Your consultation history will appear here.'}
                </p>
                {activeTab === 'upcoming' && (
                  <Button variant="primary" onClick={() => navigate('/lawyers')}>
                    Find a Lawyer
                  </Button>
                )}
              </div>
            ) : (
              displayBookings.map((booking) => (
                <div key={booking.id} className="bg-white border border-slate-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Consultation with {booking.lawyer?.full_name || 'Lawyer'}
                        </h3>
                        
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(booking.scheduled_at).toLocaleString()}
                          </span>
                          
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                        <>
                          <Button 
                            variant="primary" 
                            onClick={() => handleJoin(booking.id)}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => handleReschedule(booking.id)}
                          >
                            Reschedule
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => handleCancel(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
