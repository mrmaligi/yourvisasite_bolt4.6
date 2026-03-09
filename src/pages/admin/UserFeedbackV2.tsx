import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface FeedbackItem {
  id: string;
  user: string;
  rating: number;
  category: string;
  comment: string;
  status: 'new' | 'reviewed' | 'addressed';
  createdAt: string;
}

const MOCK_FEEDBACK: FeedbackItem[] = [
  { id: '1', user: 'John Smith', rating: 5, category: 'Platform', comment: 'Great experience!', status: 'addressed', createdAt: '2024-03-20' },
  { id: '2', user: 'Sarah Lee', rating: 4, category: 'Service', comment: 'Very helpful lawyers', status: 'reviewed', createdAt: '2024-03-19' },
  { id: '3', user: 'Mike Chen', rating: 3, category: 'Content', comment: 'Needs more guides', status: 'new', createdAt: '2024-03-18' },
];

export function UserFeedbackV2() {
  const [feedback] = useState<FeedbackItem[]>(MOCK_FEEDBACK);

  const stats = {
    averageRating: 4.2,
    total: feedback.length,
    new: feedback.filter(f => f.status === 'new').length,
    addressed: feedback.filter(f => f.status === 'addressed').length,
  };

  const getRatingStars = (rating: number) => {
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

  return (
    <>
      <Helmet>
        <title>User Feedback | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">User Feedback</h1>
                <p className="text-slate-600">Manage user reviews and ratings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.averageRating}</p>
                  <p className="text-sm text-slate-600">Avg Rating</p>
                </div>
              </div>
            </div>

            {[
              { label: 'Total', value: stats.total, icon: MessageSquare },
              { label: 'New', value: stats.new, icon: ThumbsUp, color: 'text-blue-600' },
              { label: 'Addressed', value: stats.addressed, icon: ThumbsDown, color: 'text-green-600' },
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
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">User</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Rating</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Comment</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {feedback.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.user}</td>
                      <td className="px-6 py-4">{getRatingStars(item.rating)}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary">{item.category}</Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{item.comment}</td>
                      <td className="px-6 py-4">
                        <Badge variant={item.status === 'new' ? 'danger' : item.status === 'reviewed' ? 'warning' : 'success'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.createdAt}</td>
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
