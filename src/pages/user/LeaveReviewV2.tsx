import { Star, ThumbsUp, MessageSquare, User, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export function LeaveReviewV2() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Leave a Review</h1>
          <p className="text-slate-400">Share your experience with Jane Smith</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">J</span>
            </div>
            
            <div>
              <p className="font-semibold text-slate-900">Jane Smith</p>
              <p className="text-sm text-slate-500">Migration Lawyer</p>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">How would you rate your experience?</label>
            
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-2"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">Tell us about your experience</label>
            
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What went well? What could be improved?"
              className="w-full px-3 py-2 border border-slate-200 h-32"
            />
          </div>

          <div className="mb-8">
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 w-4 h-4" />
              <span className="text-sm text-slate-600">
                I confirm this review is based on my genuine experience
              </span>
            </label>
          </div>

          <Button 
            variant="primary" 
            className="w-full"
            disabled={rating === 0}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}
