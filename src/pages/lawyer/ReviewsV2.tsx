import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, MessageSquare, Reply } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Review {
  id: string;
  client: string;
  date: string;
  rating: number;
  comment: string;
  response: string | null;
}

const MOCK_REVIEWS: Review[] = [
  { id: '1', client: 'John Doe', date: '2024-03-15', rating: 5, comment: 'Sarah was incredibly helpful with my partner visa application. Highly recommended!', response: 'Thank you John! It was a pleasure working with you.' },
  { id: '2', client: 'Alice Smith', date: '2024-03-10', rating: 4, comment: 'Very professional and knowledgeable. Process was smooth.', response: null },
  { id: '3', client: 'Robert Brown', date: '2024-02-28', rating: 5, comment: 'Exceptional service. Answered all my questions promptly.', response: null },
];

export function ReviewsV2() {
  const [reviews] = useState<Review[]>(MOCK_REVIEWS);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const stats = {
    total: reviews.length,
    average: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    fiveStar: reviews.filter(r => r.rating === 5).length,
  };

  const getStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Client Reviews | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Client Reviews</h1>
                <p className="text-slate-600">Manage and respond to client feedback</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Reviews', value: stats.total, icon: MessageSquare },
              { label: 'Average Rating', value: stats.average, icon: Star, color: 'text-yellow-600' },
              { label: '5-Star Reviews', value: stats.fiveStar, icon: Star, color: 'text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-slate-900">{review.client}</p>
                    <p className="text-sm text-slate-500">{review.date}</p>
                  </div>
                  {getStars(review.rating)}
                </div>

                <p className="text-slate-700 mb-4">{review.comment}</p>

                {review.response ? (
                  <div className="bg-slate-50 border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-900 mb-1">Your Response:</p>
                    <p className="text-slate-700">{review.response}</p>
                  </div>
                ) : (
                  <>
                    {replyingTo === review.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your response..."
                          className="w-full p-3 border border-slate-200"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button variant="primary" size="sm">Post Response</Button>
                          <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setReplyingTo(review.id)}>
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
