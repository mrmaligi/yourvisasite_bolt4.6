import { MessageSquare, ThumbsUp, ThumbsDown, Star, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserFeedbackV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Feedback</h1>
          <p className="text-slate-600">Help us improve VisaBuild</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">How was your experience?</h2>
          <div className="flex gap-4 mb-6">
            <button className="flex-1 p-4 border border-slate-200 hover:border-green-500 hover:bg-green-50 text-center">
              <ThumbsUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-slate-700">Good</p>
            </button>
            <button className="flex-1 p-4 border border-slate-200 hover:border-red-500 hover:bg-red-50 text-center">
              <ThumbsDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-slate-700">Needs Improvement</p>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Rate your overall experience</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="p-2">
                  <Star className="w-8 h-8 text-slate-300 hover:text-amber-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Tell us more</label>
            <textarea placeholder="Share your thoughts, suggestions, or report issues..." className="w-full px-3 py-2 border border-slate-200 h-32" />
          </div>

          <Button variant="primary" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Need immediate help?</p>
              <p className="text-sm text-blue-700">Contact our support team for assistance with urgent issues.</p>
              <Button variant="outline" size="sm" className="mt-2">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
