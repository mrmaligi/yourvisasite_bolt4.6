import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Shield, MapPin, Briefcase, CreditCard, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';

interface LawyerData {
  id: string;
  profile_id: string;
  jurisdiction: string;
  practice_areas: string[];
  years_experience: number;
  hourly_rate_cents: number | null;
  bar_number: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface SlotData {
  id: string;
  lawyer_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export function BookConsultation() {
  const { lawyerId } = useParams<{ lawyerId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState<LawyerData | null>(null);
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!lawyerId) {
       navigate('/lawyers');
       return;
    }

    const fetchData = async () => {
      try {
        // Fetch Lawyer Profile
        const { data: lawyerRow, error: lawyerError } = await supabase
          .schema('lawyer')
          .from('profiles')
          .select('id, profile_id, jurisdiction, practice_areas, years_experience, hourly_rate_cents, bar_number')
          .eq('id', lawyerId)
          .single();

        if (lawyerError || !lawyerRow) throw new Error('Lawyer not found');

        const { data: profileRow } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', lawyerRow.profile_id)
          .single();

        setLawyer({
          ...lawyerRow,
          full_name: profileRow?.full_name || null,
          avatar_url: profileRow?.avatar_url || null,
        });

        // Fetch Available Slots
        const now = new Date().toISOString();
        const { data: slotRows } = await supabase
          .schema('lawyer')
          .from('consultation_slots')
          .select('*')
          .eq('lawyer_id', lawyerId)
          .eq('is_booked', false)
          .or(`is_reserved.eq.false,reserved_until.lt.${now}`)
          .gte('start_time', now)
          .order('start_time');

        setSlots(slotRows || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast('error', 'Failed to load booking details');
        navigate('/lawyers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lawyerId, navigate, toast]);

  const groupSlotsByDate = (slotList: SlotData[]) => {
    const groups: Record<string, SlotData[]> = {};
    slotList.forEach((slot) => {
      const dateKey = new Date(slot.start_time).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    });
    return groups;
  };

  const handleBooking = async () => {
    if (!selectedSlot || !lawyer) return;
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast('error', 'Please sign in to book');
        navigate('/login', { state: { from: `/book-consultation/${lawyerId}` } });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consultation-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          lawyerId: lawyer.id,
          notes,
          successUrl: `${window.location.origin}/success?type=consultation`,
          cancelUrl: `${window.location.origin}/lawyers/${lawyer.id}`, // Return to profile on cancel
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      toast('error', error.message || 'Failed to start payment');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardBody className="space-y-4">
             <div className="flex gap-4">
               <Skeleton className="w-16 h-16 rounded-full" />
               <div className="space-y-2 flex-1">
                 <Skeleton className="h-6 w-1/3" />
                 <Skeleton className="h-4 w-1/4" />
               </div>
             </div>
          </CardBody>
        </Card>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lawyer) return null;

  const slotGroups = groupSlotsByDate(slots);
  const durationMinutes = selectedSlot
    ? Math.round((new Date(selectedSlot.end_time).getTime() - new Date(selectedSlot.start_time).getTime()) / 60000)
    : 0;

  const estimatedPrice = selectedSlot && lawyer.hourly_rate_cents
    ? ((lawyer.hourly_rate_cents / 60) * durationMinutes)
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 pl-0 hover:bg-transparent hover:text-primary-600"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Book Consultation</h1>
          <p className="text-neutral-500 mt-1">Select a time slot to meet with {lawyer.full_name}</p>
        </div>

        {/* Lawyer Info Card */}
        <Card>
          <CardBody className="flex items-start gap-4">
            {lawyer.avatar_url ? (
              <img src={lawyer.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-primary-600" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">{lawyer.full_name}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 mt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {lawyer.jurisdiction}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Verified
                </span>
                {lawyer.hourly_rate_cents && (
                  <span className="flex items-center gap-1.5 font-medium text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                    ${(lawyer.hourly_rate_cents / 100).toFixed(0)}/hr
                  </span>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Slot Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date & Time
            </h3>

            {slots.length === 0 ? (
              <Card>
                <CardBody className="text-center py-8">
                  <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">No available slots found.</p>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(slotGroups).map(([dateLabel, dateSlots]) => (
                  <div key={dateLabel}>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 sticky top-0 bg-neutral-50 py-1">
                      {dateLabel}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {dateSlots.map((slot) => {
                        const start = new Date(slot.start_time);
                        const timeLabel = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                        const isSelected = selectedSlot?.id === slot.id;

                        return (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-3 py-2 rounded-lg text-sm border transition-all duration-200 text-center
                              ${isSelected
                                ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium ring-1 ring-primary-600'
                                : 'border-neutral-200 text-neutral-700 hover:border-primary-300 hover:text-primary-600 bg-white'
                              }`}
                          >
                            {timeLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="space-y-4">
             <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Booking Summary
            </h3>

            <Card className="h-full">
              <CardBody className="flex flex-col h-full">
                {selectedSlot ? (
                  <>
                    <div className="space-y-3 pb-4 border-b border-neutral-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Date</span>
                        <span className="font-medium text-neutral-900">
                          {new Date(selectedSlot.start_time).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Time</span>
                        <span className="font-medium text-neutral-900">
                           {new Date(selectedSlot.start_time).toLocaleTimeString([], {timeStyle: 'short'})} - {new Date(selectedSlot.end_time).toLocaleTimeString([], {timeStyle: 'short'})}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Duration</span>
                        <span className="font-medium text-neutral-900">{durationMinutes} min</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2">
                        <span className="text-neutral-900 font-semibold">Total Price</span>
                        <span className="text-xl font-bold text-primary-600">
                          ${(estimatedPrice / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="py-4 space-y-2 flex-1">
                      <label className="block text-sm font-medium text-neutral-700">
                        Notes for Lawyer (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Briefly describe what you'd like to discuss..."
                        className="w-full rounded-lg border-neutral-200 text-sm focus:ring-primary-500 focus:border-primary-500 min-h-[100px] resize-none p-3 bg-neutral-50"
                      />
                    </div>

                    <div className="pt-4 border-t border-neutral-100">
                      <Button
                        className="w-full justify-center py-3"
                        size="lg"
                        loading={submitting}
                        onClick={handleBooking}
                      >
                        Confirm & Pay
                      </Button>
                      <p className="text-xs text-neutral-400 text-center mt-3">
                        Secure payment processing by Stripe
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400 py-12">
                    <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
                    <p className="text-sm">Select a time slot to see booking details</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
