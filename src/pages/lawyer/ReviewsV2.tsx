import { Star, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerReviewsV2() {
  const reviews = [
    { id: 1, client: 'John Doe', rating: 5, date: 'Mar 20, 2024', text: 'Excellent service, very professional and helpful throughout the process.' },
    { id: 2, client: 'Jane Smith', rating: 5, date: 'Mar 18, 2024', text: 'Highly recommend! Made the visa application process so much easier.' },
    { id: 3, client: 'Bob Wilson', rating: 4, date: 'Mar 15, 2024', text: 'Good experience overall. Responsive and knowledgeable.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Reviews</h1>
          <p className="text-slate-400">Client feedback and ratings</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6 text-center">
            <p className="text-4xl font-bold text-slate-900">4.8</p>
            <p className="text-sm text-slate-600">Average Rating</p>
            <div className="flex justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-amber-500 fill-amber-500" />
              ))}
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 text-center">
            <p className="text-4xl font-bold text-slate-900">156</p>
            <p className="text-sm text-slate-600">Total Reviews</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 text-center">
            <p className="text-4xl font-bold text-slate-900">98%</p>
            <p className="text-sm text-slate-600">Would Recommend</p>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">{review.client.charAt(0)}</span>
                  </div>
                  
                  <div>
                    <p className="font-medium text-slate-900">{review.client}</p>
                    <p className="text-sm text-slate-500">{review.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} 
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-slate-600">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
