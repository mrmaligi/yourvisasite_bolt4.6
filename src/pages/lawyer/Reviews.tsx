import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, MessageSquare, MoreHorizontal } from 'lucide-react';
import { LawyerDashboardLayout } from '@/components/layout/LawyerDashboardLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

const MOCK_REVIEWS = [
  {
    id: '1',
    client: 'John Doe',
    date: '2024-03-15',
    rating: 5,
    comment: 'Sarah was incredibly helpful with my partner visa application. Highly recommended!',
    response: 'Thank you John! It was a pleasure working with you.'
  },
  {
    id: '2',
    client: 'Alice Smith',
    date: '2024-03-10',
    rating: 4,
    comment: 'Very professional and knowledgeable. Process was smooth.',
    response: null
  },
  {
    id: '3',
    client: 'Robert Brown',
    date: '2024-02-28',
    rating: 5,
    comment: 'Exceptional service. Answered all my questions promptly.',
    response: null
  }
];

export function Reviews() {
  const { toast } = useToast();
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    // In a real app, we would use reviewId here
    console.log(`Replying to review ${reviewId}`);

    toast('success', 'Response posted successfully');
    setReplyText('');
    setReplyingTo(null);
  };

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Client Reviews | VisaBuild</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Client Reviews</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage and respond to client feedback.</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-bold text-neutral-900 dark:text-white">4.8</span>
            <span className="text-neutral-500 text-sm">Average Rating</span>
          </div>
        </div>

        <div className="grid gap-4">
          {MOCK_REVIEWS.map((review) => (
            <Card key={review.id}>
              <CardBody>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{review.client}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-neutral-200 dark:text-neutral-700'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-500">{review.date}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="px-2">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>

                <p className="text-neutral-700 dark:text-neutral-300 mb-4">{review.comment}</p>

                {review.response ? (
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border-l-4 border-primary-500">
                    <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">Your Response</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{review.response}</p>
                  </div>
                ) : (
                  <div>
                    {replyingTo === review.id ? (
                      <div className="space-y-3 mt-4">
                        <textarea
                          className="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          rows={3}
                          placeholder="Write your response..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleReply(review.id)}>Post Response</Button>
                          <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-2"
                        onClick={() => setReplyingTo(review.id)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </LawyerDashboardLayout>
  );
}
