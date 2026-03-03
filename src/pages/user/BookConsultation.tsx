import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Shield, MapPin, Briefcase, CreditCard, AlertCircle, ArrowLeft,
  FileText, CheckSquare, Square, ChevronDown, ChevronUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';

interface LawyerData {
  id: string;
  user_id: string;
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lawyer, setLawyer] = useState<LawyerData | null>(null);
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // New states
  const [visas, setVisas] = useState<{id: string, name: string}[]>([]);
  const [userDocuments, setUserDocuments] = useState<{id: string, file_name: string}[]>([]);
  const [visaPrices, setVisaPrices] = useState<Record<string, number>>({});

  const [selectedVisaId, setSelectedVisaId] = useState<string>('');
  const [questions, setQuestions] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [showDocs, setShowDocs] = useState(false);

  useEffect(() => {
    if (!lawyerId) {
       navigate('/lawyers');
       return;
    }

    const fetchData = async () => {
      try {
        // Fetch Lawyer Profile
        const { data: lawyerRow, error: lawyerError } = await supabase
          .from('lawyer_profiles')
          .select('id, user_id, jurisdiction, practice_areas, years_experience, hourly_rate_cents, bar_number')
          .eq('id', lawyerId)
          .single();

        if (lawyerError || !lawyerRow) throw new Error('Lawyer not found');

        const { data: profileRow } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', lawyerRow.user_id)
          .single();

        setLawyer({
          ...lawyerRow,
          full_name: profileRow?.full_name || null,
          avatar_url: profileRow?.avatar_url || null,
        });

        // Fetch Available Slots (consultation_slots table removed)
        setSlots([]);

        // Fetch Visas
        const { data: visaList } = await supabase
            .from('visas')
            .select('id, name')
            .eq('is_active', true)
            .order('name');
        setVisas(visaList || []);

        // Fetch User Documents
        if (user) {
            const { data: docs } = await supabase
                .from('user_documents')
                .select('id, file_name')
                .eq('user_id', user.id)
                .neq('status', 'rejected'); // Only show valid docs
            setUserDocuments(docs || []);
        }

        // Fetch Lawyer Visa Prices
        const { data: prices } = await supabase
            .from('visa_prices')
            .select('visa_id, hourly_rate_cents')
            .eq('lawyer_id', lawyerId);

        const pMap: Record<string, number> = {};
        prices?.forEach(p => {
            if(p.hourly_rate_cents !== null) {
                pMap[p.visa_id] = p.hourly_rate_cents;
            }
        });
        setVisaPrices(pMap);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast('error', 'Failed to load booking details');
        navigate('/lawyers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lawyerId, navigate, toast, user]);

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

      // Share Documents
      if (selectedDocIds.length > 0) {
        const shares = selectedDocIds.map(docId => ({
            document_id: docId,
            lawyer_id: lawyer.id
        }));

        // We use upsert to avoid errors if already shared
        const { error: shareError } = await supabase
            .from('document_shares')
            .upsert(shares, { onConflict: 'document_id, lawyer_id' });

        if (shareError) {
            console.error('Error sharing documents:', shareError);
            // Continue anyway? Or warn?
            // toast('warning', 'Failed to share some documents, but proceeding with booking.');
        }
      }

      const { data, error } = await supabase.functions.invoke('consultation-checkout', {
        body: {
          slotId: selectedSlot.id,
          lawyerId: lawyer.id,
          notes,
          questions,
          visaId: selectedVisaId || null,
          successUrl: `${window.location.origin}/success?type=consultation`,
          cancelUrl: `${window.location.origin}/lawyers/${lawyer.id}`,
        },
      });

      if (error) throw new Error(error.error || error.message || 'Failed to initiate checkout');

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

  const toggleDoc = (id: string) => {
      if (selectedDocIds.includes(id)) {
          setSelectedDocIds(selectedDocIds.filter(d => d !== id));
      } else {
          setSelectedDocIds([...selectedDocIds, id]);
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

  const hourlyRateCents = selectedVisaId && visaPrices[selectedVisaId]
      ? visaPrices[selectedVisaId]
      : (lawyer.hourly_rate_cents || 5000);

  const estimatedPrice = selectedSlot
    ? ((hourlyRateCents / 60) * durationMinutes)
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

                      {/* Visa Selection */}
                      <div className="py-2">
                        <label className="block text-xs font-medium text-neutral-500 mb-1">
                          Visa Type (Optional)
                        </label>
                        <select
                          value={selectedVisaId}
                          onChange={(e) => setSelectedVisaId(e.target.value)}
                          className="w-full text-sm rounded-lg border-neutral-200 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select a visa...</option>
                          {visas.map(visa => (
                            <option key={visa.id} value={visa.id}>
                                {visa.name} {visaPrices[visa.id] ? `($${(visaPrices[visa.id]/100).toFixed(0)}/hr)` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-between text-sm pt-2">
                        <span className="text-neutral-900 font-semibold">Hourly Rate</span>
                        <span className="text-neutral-900">
                          ${(hourlyRateCents / 100).toFixed(0)}/hr
                        </span>
                      </div>

                      <div className="flex justify-between text-sm pt-2 border-t border-neutral-100 mt-2">
                        <span className="text-neutral-900 font-semibold">Total Price</span>
                        <span className="text-xl font-bold text-primary-600">
                          ${(estimatedPrice / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="py-4 space-y-3 flex-1 overflow-y-auto max-h-[400px]">

                      {/* Document Sharing */}
                      {userDocuments.length > 0 && (
                          <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => setShowDocs(!showDocs)}
                                className="flex items-center justify-between w-full text-sm font-medium text-neutral-700 hover:text-primary-600"
                              >
                                  <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Share Documents ({selectedDocIds.length})
                                  </span>
                                  {showDocs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>

                              {showDocs && (
                                  <div className="bg-neutral-50 rounded-lg p-2 space-y-1 max-h-40 overflow-y-auto custom-scrollbar border border-neutral-100">
                                      {userDocuments.map(doc => (
                                          <div key={doc.id}
                                            onClick={() => toggleDoc(doc.id)}
                                            className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer text-sm"
                                          >
                                              {selectedDocIds.includes(doc.id)
                                                ? <CheckSquare className="w-4 h-4 text-primary-600" />
                                                : <Square className="w-4 h-4 text-neutral-400" />
                                              }
                                              <span className="truncate flex-1 text-neutral-700">{doc.file_name}</span>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Questions */}
                       <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Questions for Lawyer
                        </label>
                        <textarea
                          value={questions}
                          onChange={(e) => setQuestions(e.target.value)}
                          placeholder="List specific questions you'd like answered..."
                          className="w-full rounded-lg border-neutral-200 text-sm focus:ring-primary-500 focus:border-primary-500 min-h-[80px] resize-none p-3 bg-neutral-50"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Notes / Context (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Briefly describe your situation..."
                          className="w-full rounded-lg border-neutral-200 text-sm focus:ring-primary-500 focus:border-primary-500 min-h-[80px] resize-none p-3 bg-neutral-50"
                        />
                      </div>
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
