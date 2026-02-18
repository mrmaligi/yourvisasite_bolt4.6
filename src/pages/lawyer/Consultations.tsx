import { useState } from 'react';
import { Calendar, History } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { useBookings } from '../../hooks/useBookings';
import { BookingCard } from '../../components/BookingCard';

export function LawyerConsultations() {
  const { bookings, loading, refetch } = useBookings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast('success', `Consultation marked as ${status}`);
      refetch();
    } catch (error) {
      toast('error', `Failed to update status`);
    }
  };

  const handleConfirm = (id: string) => updateStatus(id, 'confirmed');
  const handleComplete = (id: string) => updateStatus(id, 'completed');
  const handleCancel = (id: string) => updateStatus(id, 'cancelled');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-neutral-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const now = new Date();
  const upcomingBookings = bookings.filter(b => {
    const time = b.start_time ? new Date(b.start_time) : new Date(b.created_at);
    return time >= now && b.status !== 'cancelled' && b.status !== 'completed';
  });

  const pastBookings = bookings.filter(b => {
    const time = b.start_time ? new Date(b.start_time) : new Date(b.created_at);
    return time < now || b.status === 'cancelled' || b.status === 'completed';
  });

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Manage Consultations</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'upcoming'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'past'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          History ({pastBookings.length})
        </button>
      </div>

      {displayBookings.length === 0 ? (
        <EmptyState
          icon={activeTab === 'upcoming' ? Calendar : History}
          title={`No ${activeTab} bookings`}
          description={
            activeTab === 'upcoming'
              ? "You don't have any upcoming consultations scheduled."
              : "No past consultations found."
          }
        />
      ) : (
        <div className="space-y-4">
          {displayBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              userType="lawyer"
              onConfirm={booking.status === 'pending' ? handleConfirm : undefined}
              onComplete={booking.status === 'confirmed' ? handleComplete : undefined}
              onCancel={booking.status === 'pending' || booking.status === 'confirmed' ? handleCancel : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
