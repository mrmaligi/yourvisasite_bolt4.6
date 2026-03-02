import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending';
  reply?: string;
}

const fetchPendingReviews = async (): Promise<Review[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      id: '3',
      clientName: 'Charlie Brown',
      rating: 5,
      comment: 'Highly recommend!',
      date: '2023-11-20',
      status: 'pending',
    },
  ];
};

export const RespondReviews = () => {
  const { addToast } = useToast();
  const [replyText, setReplyText] = useState('');
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['lawyer-reviews-pending'],
    queryFn: fetchPendingReviews,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, reply };
    },
    onSuccess: () => {
      addToast('success', 'Reply posted successfully');
      setReplyText('');
      setActiveReviewId(null);
      refetch();
    },
    onError: () => {
      addToast('error', 'Failed to post reply');
    }
  });

  const handleReply = (id: string) => {
    mutation.mutate({ id, reply: replyText });
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Respond to Reviews</h1>
          <p className="text-neutral-500 mt-1">Engage with your clients and build trust</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews?.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No pending reviews to respond to.</p>
        ) : (
          reviews?.map((review) => (
            <Card key={review.id}>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">{review.clientName}</div>
                    <span className="text-xs text-neutral-500">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-neutral-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300">"{review.comment}"</p>

                {activeReviewId === review.id ? (
                  <div className="space-y-2 mt-4 animate-in fade-in">
                    <Textarea
                      label="Your Reply"
                      placeholder="Write a professional response..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="secondary" onClick={() => setActiveReviewId(null)}>Cancel</Button>
                      <Button onClick={() => handleReply(review.id)} disabled={!replyText || mutation.isPending}>
                        {mutation.isPending ? 'Posting...' : 'Post Reply'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => setActiveReviewId(review.id)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                )}
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
};
