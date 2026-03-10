import { MessageSquare, ThumbsUp, Flag, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminCommentsV2() {
  const comments = [
    { id: 1, user: 'John Doe', content: 'Great article! Very helpful.', post: 'Partner Visa Guide', status: 'approved', date: 'Mar 20, 2024' },
    { id: 2, user: 'Jane Smith', content: 'Thanks for the information.', post: 'Document Checklist', status: 'pending', date: 'Mar 19, 2024' },
    { id: 3, user: 'Bob Wilson', content: 'This is exactly what I needed.', post: 'Visa Timeline', status: 'approved', date: 'Mar 18, 2024' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Comments</h1>
          <p className="text-slate-400">Moderate user comments</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <span className="font-bold text-blue-600">{comment.user.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{comment.user}</p>
                      <p className="text-sm text-slate-500">on {comment.post} • {comment.date}</p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium ${
                    comment.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {comment.status}
                  </span>
                </div>
                
                <p className="text-slate-700 mb-4">{comment.content}</p>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-green-600"><CheckCircle className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-amber-600"><Flag className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
