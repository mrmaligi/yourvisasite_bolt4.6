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
  visaType: string;
}

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: '1', clientName: 'Sarah Johnson', rating: 5, content: 'Excellent service, very professional. Made my partner visa process so smooth!', status: 'published', date: '2024-03-18', visaType: 'Partner Visa' },
  { id: '2', clientName: 'Michael Chen', rating: 4, content: 'Good communication but slightly delayed response times.', status: 'pending', date: '2024-03-15', visaType: 'Skilled Independent' },
  { id: '3', clientName: 'Emma Wilson', rating: 5, content: 'Highly recommend! Best immigration lawyer I have worked with.', status: 'published', date: '2024-03-10', visaType: 'Employer Nomination' },
  { id: '4', clientName: 'David Brown', rating: 5, content: 'Very knowledgeable and patient. Answered all my questions.', status: 'published', date: '2024-03-05', visaType: 'Student Visa' },
];

export function TestimonialsV2() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTestimonials = MOCK_TESTIMONIALS.filter(t => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const stats = {
    total: MOCK_TESTIMONIALS.length,
    published: MOCK_TESTIMONIALS.filter(t => t.status === 'published').length,
    pending: MOCK_TESTIMONIALS.filter(t => t.status === 'pending').length,
    averageRating: (MOCK_TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / MOCK_TESTIMONIALS.length).toFixed(1),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <Badge variant="success">Published</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'hidden': return <Badge variant="secondary">Hidden</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Testimonials | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
                <p className="text-slate-600">Manage client testimonials and reviews</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Quote },
              { label: 'Published', value: stats.published, icon: CheckCircle },
              { label: 'Pending', value: stats.pending, icon: XCircle },
              { label: 'Avg Rating', value: stats.averageRating, icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs - SQUARE */}
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {['all', 'published', 'pending', 'hidden'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Testimonials Grid - SQUARE */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                      {testimonial.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.clientName}</p>
                      <p className="text-sm text-slate-500">{testimonial.visaType}</p>
                    </div>
                  </div>
                  {getStatusBadge(testimonial.status)}
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                    />
                  ))}
                </div>

                <p className="text-slate-700 mb-4">"{testimonial.content}"</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-sm text-slate-500">{testimonial.date}</span>
                  <div className="flex gap-2">
                    {testimonial.status === 'pending' && (
                      <>
                        <Button variant="primary" size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="danger" size="sm">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
