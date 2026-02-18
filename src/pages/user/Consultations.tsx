import { useState, useEffect } from 'react';
import { Calendar, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { useBookings } from '../../hooks/useBookings';
import { BookingCard } from '../../components/BookingCard';
import { Modal } from '../../components/ui/Modal';
import { ReviewForm } from '../../components/ReviewForm';

export function Consultations() {
  const { user } = useAuth();
  const { bookings, loading, refetch } = useBookings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [reviews, setReviews] = useState<Set<string>>(new Set());
  const [reviewModal, setReviewModal] = useState<{ bookingId: string; lawyerId: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('lawyer_reviews')
        .select('booking_id')
        .eq('user_id', user.id);

      if (data) {
        setReviews(new Set(data.map((r) => r.booking_id)));
      }
    };
    fetchReviews();
  }, [user]);

  const handleReview = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setReviewModal({
        bookingId: booking.id,
        lawyerId: booking.lawyer_id,
      });
    }
  };

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
    // For now, just show a message. Ideally this would open a reschedule flow.
    toast('info', 'Please contact the lawyer directly to reschedule.');
  };

  const handleJoin = (id: string) => {
      // Logic to join call (e.g. open video link if available)
      // Since video link isn't in schema yet, we'll just show a toast or placeholder
      toast('info', 'Joining consultation room...');
      // window.open(`/consultation-room/${id}`, '_blank');
  };

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
        <h1 className="text-2xl font-bold text-neutral-900">My Consultations</h1>
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
          Past ({pastBookings.length})
        </button>
      </div>

      {displayBookings.length === 0 ? (
        <EmptyState
          icon={activeTab === 'upcoming' ? Calendar : History}
          title={`No ${activeTab} consultations`}
          description={
            activeTab === 'upcoming'
              ? "You don't have any upcoming consultations scheduled."
              : "You haven't completed any consultations yet."
          }
          action={
             activeTab === 'upcoming' ? {
                 label: "Find a Lawyer",
                 onClick: () => window.location.href = '/lawyers' // Or use navigate
             } : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {displayBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              userType="user"
              onCancel={booking.status === 'pending' || booking.status === 'confirmed' ? handleCancel : undefined}
              onReschedule={booking.status === 'pending' || booking.status === 'confirmed' ? handleReschedule : undefined}
              onJoin={booking.status === 'confirmed' ? handleJoin : undefined}
              onReview={handleReview}
              hasReview={reviews.has(booking.id)}
            />
          ))}
        </div>
      )}

      {reviewModal && (
        <Modal
          isOpen={!!reviewModal}
          onClose={() => setReviewModal(null)}
          title="Rate Your Experience"
        >
          <ReviewForm
            bookingId={reviewModal.bookingId}
            lawyerId={reviewModal.lawyerId}
            onSuccess={() => {
              setReviewModal(null);
              setReviews((prev) => {
                const next = new Set(prev);
                next.add(reviewModal.bookingId);
                return next;
              });
            }}
            onCancel={() => setReviewModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
