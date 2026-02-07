import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Briefcase, Clock, Scale, Calendar,
  CheckCircle, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';

interface LawyerData {
  id: string;
  profile_id: string;
  jurisdiction: string;
  practice_areas: string[];
  years_experience: number;
  bio: string | null;
  hourly_rate_cents: number | null;
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

export function LawyerProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<LawyerData | null>(null);
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchLawyer() {
      const { data: lawyerRow } = await supabase
        .schema('lawyer')
        .from('profiles')
        .select('id, profile_id, jurisdiction, practice_areas, years_experience, bio, hourly_rate_cents')
        .eq('id', id)
        .eq('is_verified', true)
        .maybeSingle();

      if (!lawyerRow) {
        setLoading(false);
        return;
      }

      const { data: profileRow } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', lawyerRow.profile_id)
        .maybeSingle();

      setLawyer({
        ...lawyerRow,
        full_name: profileRow?.full_name || null,
        avatar_url: profileRow?.avatar_url || null,
      });

      const now = new Date().toISOString();
      const { data: slotRows } = await supabase
        .schema('lawyer')
        .from('consultation_slots')
        .select('*')
        .eq('lawyer_id', lawyerRow.id)
        .eq('is_booked', false)
        .gte('start_time', now)
        .order('start_time');

      setSlots(slotRows || []);
      setLoading(false);
    }

    fetchLawyer();
  }, [id]);

  const handleBook = async () => {
    if (!user || !selectedSlot || !lawyer) return;
    setSubmitting(true);

    const start = new Date(selectedSlot.start_time);
    const end = new Date(selectedSlot.end_time);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
    const rateCents = lawyer.hourly_rate_cents || 0;
    const totalCents = Math.round((rateCents / 60) * durationMinutes);

    const { error: bookingError } = await supabase.from('bookings').insert({
      user_id: user.id,
      lawyer_id: lawyer.id,
      slot_id: selectedSlot.id,
      duration_minutes: durationMinutes,
      total_price_cents: totalCents,
      status: 'pending',
      notes: bookingNotes || null,
    });

    if (bookingError) {
      toast('error', 'Failed to book consultation. Please try again.');
      setSubmitting(false);
      return;
    }

    await supabase
      .schema('lawyer')
      .from('consultation_slots')
      .update({ is_booked: true })
      .eq('id', selectedSlot.id);

    toast('success', 'Consultation booked! You can manage it from your dashboard.');
    setSelectedSlot(null);
    setBookingNotes('');
    setSubmitting(false);
    navigate('/dashboard/consultations');
  };

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Lawyer not found</h2>
        <Link to="/lawyers" className="text-primary-600 hover:underline">Browse all lawyers</Link>
      </div>
    );
  }

  const slotGroups = groupSlotsByDate(slots);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/lawyers" className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:underline mb-8">
        <ArrowLeft className="w-3.5 h-3.5" />
        All Lawyers
      </Link>

      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        {lawyer.avatar_url ? (
          <img
            src={lawyer.avatar_url}
            alt=""
            className="w-20 h-20 rounded-full object-cover ring-4 ring-neutral-100"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
            <Scale className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-2xl font-bold text-neutral-900">
              {lawyer.full_name || 'Immigration Lawyer'}
            </h1>
            <Badge variant="success">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-500 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {lawyer.jurisdiction}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              {lawyer.years_experience} years experience
            </span>
            {lawyer.hourly_rate_cents && (
              <span className="flex items-center gap-1.5 font-semibold text-neutral-900">
                ${(lawyer.hourly_rate_cents / 100).toFixed(0)}/hr
              </span>
            )}
          </div>
        </div>
      </div>

      {lawyer.bio && (
        <Card className="mb-6">
          <CardBody>
            <h2 className="text-sm font-semibold text-neutral-900 mb-2">About</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">{lawyer.bio}</p>
          </CardBody>
        </Card>
      )}

      <Card className="mb-6">
        <CardBody>
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">Practice Areas</h2>
          <div className="flex flex-wrap gap-2">
            {lawyer.practice_areas.map((area) => (
              <Badge key={area} variant="primary">{area}</Badge>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Available Time Slots
          </h2>
        </CardHeader>
        <CardBody>
          {slots.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No availability at the moment. Check back later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(slotGroups).map(([dateLabel, dateSlots]) => (
                <div key={dateLabel}>
                  <p className="text-sm font-semibold text-neutral-700 mb-3">{dateLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {dateSlots.map((slot) => {
                      const start = new Date(slot.start_time);
                      const end = new Date(slot.end_time);
                      const time = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                      const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                      return (
                        <button
                          key={slot.id}
                          onClick={() => {
                            if (!user) {
                              toast('info', 'Please sign in to book a consultation');
                              return;
                            }
                            setSelectedSlot(slot);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
                        >
                          {time} - {endTime}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={!!selectedSlot}
        onClose={() => { setSelectedSlot(null); setBookingNotes(''); }}
        title="Book Consultation"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setSelectedSlot(null); setBookingNotes(''); }}>
              Cancel
            </Button>
            <Button loading={submitting} onClick={handleBook}>
              Confirm Booking
            </Button>
          </>
        }
      >
        {selectedSlot && (
          <div className="space-y-5">
            <div className="p-4 bg-neutral-50 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Lawyer</span>
                <span className="font-medium text-neutral-900">{lawyer.full_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Date</span>
                <span className="font-medium text-neutral-900">
                  {new Date(selectedSlot.start_time).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Time</span>
                <span className="font-medium text-neutral-900">
                  {new Date(selectedSlot.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  {' - '}
                  {new Date(selectedSlot.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
              {lawyer.hourly_rate_cents && (
                <div className="flex justify-between text-sm pt-2 border-t border-neutral-200">
                  <span className="text-neutral-500">Estimated cost</span>
                  <span className="font-semibold text-neutral-900">
                    ${(
                      (lawyer.hourly_rate_cents / 60) *
                      Math.round((new Date(selectedSlot.end_time).getTime() - new Date(selectedSlot.start_time).getTime()) / 60000) /
                      100
                    ).toFixed(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Notes (optional)</label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Briefly describe your visa situation or questions..."
                className="input-field min-h-[80px]"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
