import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Testimonial {
  id: string;
  clientName: string;
  rating: number;
  content: string;
  status: 'published' | 'pending' | 'hidden';
  date: string;
}

const MOCK_REVIEWS: Testimonial[] = [
  { id: '1', clientName: 'Sarah Johnson', rating: 5, content: 'Excellent service, very professional.', status: 'published', date: '2024-03-18' },
  { id: '2', clientName: 'Michael Chen', rating: 4, content: 'Good communication but slightly delayed.', status: 'pending', date: '2024-03-15' },
  { id: '3', clientName: 'Anonymous', rating: 5, content: 'Highly recommend!', status: 'published', date: '2024-03-10' },
];

export function TestimonialsV2() {
  const [reviews] = useState<Testimonial[]>(MOCK_REVIEWS);

  const stats = {
    total: reviews.length,
    published: reviews.filter(r => r.status === 'published').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    average: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
  };

  return (
    <>
      <Helmet>
        <title>Testimonials | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
                <p className="text-slate-600">Manage client reviews and testimonials</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Reviews', value: stats.total, icon: MessageSquare },
              { label: 'Published', value: stats.published, icon: CheckCircle, color: 'text-green-600' },
              { label: 'Pending', value: stats.pending, icon: XCircle, color: 'text-yellow-600' },
              { label: 'Avg Rating', value: stats.average, icon: Star, color: 'text-yellow-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Client</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Rating</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Review</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{review.clientName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{review.content}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          review.status === 'published' ? 'success' : 
                          review.status === 'pending' ? 'warning' : 'secondary'
                        }>
                          {review.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{review.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
