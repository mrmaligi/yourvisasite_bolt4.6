import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const MOCK_REVIEWS = [
  {
    id: '1',
    client: 'John Doe',
    date: '2024-03-15',
    rating: 5,
    comment: 'Sarah was incredibly helpful with my partner visa application. Highly recommended!',
    response: 'Thank you John! It was a pleasure working with you.',
    visaType: 'Partner Visa',
  },
  {
    id: '2',
    client: 'Alice Smith',
    date: '2024-03-10',
    rating: 4,
    comment: 'Very professional and knowledgeable. Process was smooth.',
    response: null,
    visaType: 'Skilled Independent',
  },
  {
    id: '3',
    client: 'Robert Brown',
    date: '2024-02-28',
    rating: 5,
    comment: 'Exceptional service. Answered all my questions promptly.',
    response: null,
    visaType: 'Student Visa',
  },
  {
    id: '4',
    client: 'Emma Wilson',
    date: '2024-02-20',
    rating: 5,
    comment: 'Best lawyer I have worked with. Made the complex process simple.',
    response: 'Thank you Emma! Wishing you all the best.',
    visaType: 'Employer Nomination',
  },
];

export function ReviewsV2() {
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const averageRating = (MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);
  const totalReviews = MOCK_REVIEWS.length;
  const respondedReviews = MOCK_REVIEWS.filter(r => r.response).length;

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    alert('Reply posted!');
    setReplyText('');
    setReplyingTo(null);
  };

  return (
    <>
      <Helmet>
        <title>Client Reviews | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Client Reviews</h1>
                <p className="text-slate-600">Manage and respond to client feedback</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{averageRating}</p>
                  <p className="text-sm text-slate-600">Average Rating</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{totalReviews}</p>
                  <p className="text-sm text-slate-600">Total Reviews</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{respondedReviews}</p>
                  <p className="text-sm text-slate-600">Responded</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List - SQUARE */}
          <div className="space-y-4">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <span className="font-semibold text-blue-600">{review.client.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{review.client}</p>
                      <p className="text-sm text-slate-500">{review.date} • {review.visaType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-slate-700 mb-4">{review.comment}</p>

                {review.response ? (
                  <div className="bg-slate-50 border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-600 mb-1">Your Response:</p>
                    <p className="text-slate-700">{review.response}</p>
                  </div>
                ) : replyingTo === review.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your response..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReply(review.id)}
                      >
                        Post Response
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyingTo(review.id)}
                  >
                    Reply to Review
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
