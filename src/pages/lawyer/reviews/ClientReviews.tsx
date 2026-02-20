import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'flagged';
}

const fetchReviews = async (): Promise<Review[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      id: '1',
      clientName: 'Alice Smith',
      rating: 5,
      comment: 'Excellent service! Very knowledgeable and helpful throughout the process.',
      date: '2023-10-15',
      status: 'published',
    },
    {
      id: '2',
      clientName: 'Bob Jones',
      rating: 4,
      comment: 'Good advice, but communication could be slightly faster.',
      date: '2023-11-02',
      status: 'published',
    },
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

export const ClientReviews = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['lawyer-reviews'],
    queryFn: fetchReviews,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Client Reviews</h1>
          <p className="text-neutral-500 mt-1">Feedback from your consultations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">4.8 Average Rating</Badge>
          <Badge variant="info">{reviews?.length} Total Reviews</Badge>
        </div>
      </div>

      <div className="space-y-4">
        {reviews?.map((review) => (
          <Card key={review.id}>
            <CardBody>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-neutral-900 dark:text-white">{review.clientName}</div>
                  <span className="text-xs text-neutral-500">• {new Date(review.date).toLocaleDateString()}</span>
                </div>
                <Badge variant={review.status === 'published' ? 'success' : review.status === 'pending' ? 'warning' : 'danger'}>
                  {review.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1 mb-2 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-neutral-300 dark:text-neutral-600'}`} />
                ))}
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                "{review.comment}"
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
