import { MessageSquare, ThumbsUp, ThumbsDown, Send, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export function UserFeedbackV2() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Feedback</h1>
          <p className="text-slate-400">Help us improve your experience</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">How would you rate your experience?</h2>
          
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-2"
              >
                <Star 
                  className={`w-8 h-8 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} 
                />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Your Feedback</label>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full px-3 py-2 border border-slate-200 h-32"
            />
          </div>

          <Button variant="primary">
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
