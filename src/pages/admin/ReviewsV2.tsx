import { MessageSquare, ThumbsUp, ThumbsDown, Star, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminReviewsV2() {
  const reviews = [
    { id: 1, user: 'John Doe', lawyer: 'Jane Smith', rating: 5, comment: 'Excellent service, very professional', date: 'Mar 20, 2024', status: 'approved' },
    { id: 2, user: 'Alice Brown', lawyer: 'Michael Brown', rating: 4, comment: 'Good experience overall', date: 'Mar 18, 2024', status: 'pending' },
    { id: 3, user: 'Bob Wilson', lawyer: 'Sarah Lee', rating: 5, comment: 'Highly recommended!', date: 'Mar 15, 2024', status: 'approved' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Reviews</h1>
          <p className="text-slate-400">Manage user reviews and ratings</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-900">1,234</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Average Rating</p>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-bold text-slate-900">4.7</p>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Pending</p>
            <p className="text-2xl font-bold text-amber-600">12</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-900">{review.user}</p>
                    <p className="text-sm text-slate-500">reviewed {review.lawyer} • {review.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-slate-700 mb-3">{review.comment}</p>
                
                <div className="flex items-center gap-2">
                  {review.status === 'approved' ? (
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" /> Approved
                    </span>
                  ) : (
                    <>
                      <Button variant="outline" size="sm">Approve</Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600">Reject</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
