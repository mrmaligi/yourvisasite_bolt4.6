import { MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CommentsV2() {
  const comments = [
    { id: 1, user: 'John Doe', content: 'Great article! Very helpful.', article: 'Partner Visa Guide', date: '2024-03-20', status: 'approved' },
    { id: 2, user: 'Jane Smith', content: 'Thanks for sharing this info.', article: 'Skilled Migration Tips', date: '2024-03-19', status: 'pending' },
    { id: 3, user: 'Bob Wilson', content: 'Can you provide more details?', article: 'Student Visa Guide', date: '2024-03-18', status: 'approved' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Comments</h1>
          <p className="text-slate-600">Moderate user comments</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total', value: '1,240', icon: MessageSquare },
            { label: 'Pending', value: '23', icon: AlertCircle },
            { label: 'Approved', value: '1,180', icon: CheckCircle },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <stat.icon className="w-5 h-5 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">{comment.user}</span>
                      <span className={`px-2 py-0.5 text-xs ${
                        comment.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {comment.status}
                      </span>
                    </div>
                    <p className="text-slate-700">{comment.content}</p>
                    <p className="text-xs text-slate-400 mt-1">On: {comment.article} • {comment.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Approve</Button>
                    <Button variant="outline" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
