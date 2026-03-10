import { Star, ThumbsUp, MessageSquare, User, CheckCircle, Flag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export function ReviewDetailV2() {
  const [helpful, setHelpful] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Reviews</span>
            <span>/</span>
            <span className="text-white">Review Details</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Client Review</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">J</span>
            </div>
            
            <div className="flex-1">
              <p className="text-xl font-semibold text-slate-900">John Doe</p>
              <p className="text-slate-500">Reviewed Jane Smith • Mar 20, 2024</p>
              
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-2">Excellent Service</h3>
            <p className="text-slate-600">
              Jane was incredibly helpful throughout my partner visa application process. 
              She explained everything clearly and was always available to answer my questions. 
              Highly recommended!
            </p>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
            <button 
              onClick={() => setHelpful(!helpful)}
              className={`flex items-center gap-2 px-4 py-2 border ${helpful ? 'bg-blue-50 border-blue-600 text-blue-600' : 'border-slate-200 text-slate-600'}`}
            >
              <ThumbsUp className="w-4 h-4" />
              Helpful (12)
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600">
              <MessageSquare className="w-4 h-4" />
              Reply
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 ml-auto">
              <Flag className="w-4 h-4" />
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
