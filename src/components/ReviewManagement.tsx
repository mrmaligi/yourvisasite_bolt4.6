import { useEffect, useState } from 'react';
import { Star, MessageSquare, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';
import { LawyerReview } from '../types/database';

interface ReviewWithUser extends LawyerReview {
  user_full_name: string | null;
}

export function ReviewManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      // First get lawyer profile id
      const { data: lawyerProfile } = await supabase
        
        .from('lawyer_profiles')
        .select('id')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (!lawyerProfile) {
        setLoading(false);
        return;
      }

      const { data: reviewData, error } = await supabase
        .from('lawyer_reviews')
        .select('*')
        .eq('lawyer_id', lawyerProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user names
      const userIds = [...new Set(reviewData?.map((r) => r.user_id) || [])];
      const { data: userProfiles } = await supabase
        .from('lawyer_profiles')
        .select('id, full_name')
        .in('id', userIds);

      const userMap = new Map(userProfiles?.map((u) => [u.id, u.full_name]) || []);

      const enrichedReviews = reviewData?.map((r) => ({
        ...r,
        user_full_name: userMap.get(r.user_id) || 'Anonymous User',
      })) || [];

      setReviews(enrichedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast('error', 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('lawyer_reviews')
        .update({
          reply_text: replyText.trim(),
          replied_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast('success', 'Reply posted successfully');
      setReplyingTo(null);
      setReplyText('');
      fetchReviews();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast('error', 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-neutral-100 rounded-xl" />;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 rounded-xl border border-neutral-200">
        <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-neutral-900">No reviews yet</h3>
        <p className="text-neutral-500">Reviews from your clients will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardBody>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-neutral-900">
                    {review.user_full_name}
                  </h3>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <p className="text-neutral-700 mb-6 whitespace-pre-wrap">{review.review_text}</p>

            {review.reply_text ? (
              <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4 ml-8">
                <p className="text-xs font-semibold text-neutral-900 mb-1 flex items-center justify-between">
                  Your Reply
                  <span className="text-neutral-400 font-normal">
                    {review.replied_at && new Date(review.replied_at).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm text-neutral-600 whitespace-pre-wrap">{review.reply_text}</p>
              </div>
            ) : (
              <div className="ml-8">
                {replyingTo === review.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply to this review..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReplySubmit(review.id)}
                        disabled={submitting || !replyText.trim()}
                      >
                        {submitting ? 'Posting...' : 'Post Reply'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setReplyingTo(review.id)}
                  >
                    Reply
                  </Button>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
