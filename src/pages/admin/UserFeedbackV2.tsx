import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const MOCK_FEEDBACK = [
  { id: '1', user: 'John Doe', role: 'user', rating: 5, category: 'platform', comment: 'Great platform, very helpful!', status: 'new', date: '2024-03-20' },
  { id: '2', user: 'Sarah Smith', role: 'lawyer', rating: 4, category: 'service', comment: 'Good service but could be faster.', status: 'reviewed', date: '2024-03-19' },
  { id: '3', user: 'Mike Brown', role: 'user', rating: 5, category: 'content', comment: 'Visa guides are excellent.', status: 'addressed', date: '2024-03-18' },
  { id: '4', user: 'Emma Wilson', role: 'user', rating: 3, category: 'platform', comment: 'UI could be improved.', status: 'new', date: '2024-03-17' },
];

export function UserFeedbackV2() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredFeedback = MOCK_FEEDBACK.filter(f => {
    if (activeTab === 'all') return true;
    return f.status === activeTab;
  });

  const stats = {
    averageRating: (MOCK_FEEDBACK.reduce((sum, f) => sum + f.rating, 0) / MOCK_FEEDBACK.length).toFixed(1),
    total: MOCK_FEEDBACK.length,
    new: MOCK_FEEDBACK.filter(f => f.status === 'new').length,
    addressed: MOCK_FEEDBACK.filter(f => f.status === 'addressed').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge variant="primary">New</Badge>;
      case 'reviewed': return <Badge variant="warning">Reviewed</Badge>;
      case 'addressed': return <Badge variant="success">Addressed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      platform: 'bg-blue-100 text-blue-700',
      service: 'bg-green-100 text-green-700',
      content: 'bg-purple-100 text-purple-700',
      lawyer: 'bg-amber-100 text-amber-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium ${colors[category] || 'bg-slate-100 text-slate-700'}`}>
        {category}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>User Feedback | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">User Feedback</h1>
                <p className="text-slate-600">Review and manage user feedback</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Average Rating', value: stats.averageRating, icon: Star, color: 'bg-amber-100 text-amber-600' },
              { label: 'Total Feedback', value: stats.total, icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
              { label: 'New', value: stats.new, icon: Clock, color: 'bg-green-100 text-green-600' },
              { label: 'Addressed', value: stats.addressed, icon: CheckCircle, color: 'bg-purple-100 text-purple-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
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
            {['all', 'new', 'reviewed', 'addressed'].map((tab) => (
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

          {/* Feedback List - SQUARE */}
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                      {item.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.user}</p>
                      <p className="text-sm text-slate-500 capitalize">{item.role} • {item.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {getCategoryBadge(item.category)}
                </div>

                <p className="text-slate-700 mb-4">{item.comment}</p>

                <div className="flex gap-2">
                  {item.status === 'new' && (
                    <>
                      <Button variant="primary" size="sm">Mark Reviewed</Button>
                      <Button variant="outline" size="sm">Mark Addressed</Button>
                    </>
                  )}
                  {item.status === 'reviewed' && (
                    <Button variant="primary" size="sm">Mark Addressed</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
