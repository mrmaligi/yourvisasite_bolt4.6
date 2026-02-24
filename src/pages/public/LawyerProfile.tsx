import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Briefcase, Clock, Scale, Calendar,
  CheckCircle, Star, Shield, MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

interface LawyerData {
  id: string;
  profile_id: string;
  jurisdiction: string;
  practice_areas: string[];
  years_experience: number;
  bio: string | null;
  hourly_rate_cents: number | null;
  bar_number: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface LawyerReview {
  id: string;
  user_id: string;
  rating: number;
  review_text: string;
  reply_text: string | null;
  replied_at: string | null;
  created_at: string;
  user_full_name?: string;
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
  const [reviews, setReviews] = useState<LawyerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchLawyer() {
      const { data: lawyerRow } = await supabase
        .from('lawyer_profiles')
        .select('id, profile_id, jurisdiction, practice_areas, years_experience, bio, hourly_rate_cents, bar_number')
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

      // consultation_slots removed
      setSlots([]);

      // Fetch reviews
      const { data: reviewRows } = await supabase
        .from('lawyer_reviews')
        .select('*')
        .eq('lawyer_id', lawyerRow.id)
        .order('created_at', { ascending: false });

      if (reviewRows && reviewRows.length > 0) {
        const userIds = [...new Set(reviewRows.map(r => r.user_id))];
        const { data: users } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        const userMap = new Map(users?.map(u => [u.id, u.full_name]) || []);

        setReviews(reviewRows.map(r => ({
          ...r,
          user_full_name: userMap.get(r.user_id) || 'Anonymous'
        })));
      } else {
        setReviews([]);
      }

      setLoading(false);
    }

    fetchLawyer();
  }, [id]);

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
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Lawyers', to: '/lawyers' },
          { label: lawyer.full_name || 'Lawyer Profile' }
        ]}
        className="mb-8"
      />

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
            {reviews.length > 0 && (
              <span className="flex items-center gap-1.5 text-yellow-600 font-medium">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {lawyer.jurisdiction}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              {lawyer.years_experience} years experience
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Bar #{lawyer.bar_number}
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

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
           <Card>
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
                                  navigate('/login', { state: { from: `/dashboard/book-consultation/${id}` } });
                                  return;
                                }
                                navigate(`/dashboard/book-consultation/${id}`);
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
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Reviews
              </h2>
            </CardHeader>
            <CardBody>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500">No reviews yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm text-neutral-900">{review.user_full_name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-neutral-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                        {review.review_text}
                      </p>
                      {review.reply_text && (
                        <div className="bg-neutral-50 rounded-lg p-3 text-xs">
                          <p className="font-semibold text-neutral-900 mb-1">Lawyer Response</p>
                          <p className="text-neutral-600">{review.reply_text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
