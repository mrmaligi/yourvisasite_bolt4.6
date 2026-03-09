import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, CheckCircle, XCircle, Trash2, Quote } from 'lucide-react';
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

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: '1', clientName: 'Sarah Johnson', rating: 5, content: 'Excellent service, very professional.', status: 'published', date: '2024-03-18' },
  { id: '2', clientName: 'Michael Chen', rating: 4, content: 'Good communication but slightly delayed.', status: 'pending', date: '2024-03-15' },
  { id: '3', clientName: 'Anonymous', rating: 5, content: 'Highly recommend!', status: 'published', date: '2024-03-10' },
];

export function TestimonialsV2() {
  const [testimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);

  const stats = {
    total: testimonials.length,
    published: testimonials.filter(t => t.status === 'published').length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    average: (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1),
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'secondary'> = {
      published: 'success',
      pending: 'warning',
      hidden: 'secondary',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
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
                <p className="text-slate-600">Manage client testimonials</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Quote },
              { label: 'Published', value: stats.published, icon: CheckCircle, color: 'text-green-600' },
              { label: 'Pending', value: stats.pending, icon: XCircle, color: 'text-yellow-600' },
              { label: 'Avg Rating', value: stats.average, icon: Star, color: 'text-yellow-600' },
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
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {testimonials.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{t.clientName}</td>
                      <td className="px-6 py-4">{getStars(t.rating)}</td>
                      <td className="px-6 py-4 text-slate-700 max-w-xs truncate">{t.content}</td>
                      <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                      <td className="px-6 py-4 text-slate-600">{t.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {t.status === 'pending' && (
                            <Button variant="primary" size="sm">Approve</Button>
                          )}
                          <Button variant="danger" size="sm">
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
