import { Helmet } from 'react-helmet-async';
import { MessageSquare, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Category {
  id: string;
  name: string;
  description: string;
  topicCount: number;
  postCount: number;
  lastActivity: string;
}

const categories: Category[] = [
  { id: '1', name: 'General Discussion', description: 'Talk about anything and everything', topicCount: 142, postCount: 1205, lastActivity: '2 min ago' },
  { id: '2', name: 'Technical Support', description: 'Get help with technical issues', topicCount: 89, postCount: 567, lastActivity: '15 min ago' },
  { id: '3', name: 'Announcements', description: 'Official news and updates', topicCount: 24, postCount: 189, lastActivity: '1 hour ago' },
];

export function ForumCategoryPageV2() {
  return (
    <>
      <Helmet>
        <title>Forum - General Discussion | VisaBuild</title>
        <meta name="description" content="Community forum for visa discussions." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <Link to="/forum" className="hover:text-[#2563EB] cursor-pointer">Forum</Link>
              <span>/</span>
              <span className="text-slate-900">General Discussion</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-slate-900">General Discussion</h1>
              <Button variant="primary">Start New Topic</Button>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white border border-slate-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-100 border-b border-slate-200 text-sm font-medium text-slate-700">
              <div className="col-span-7">Topic</div>
              <div className="col-span-2 text-center">Replies</div>
              <div className="col-span-3">Last Post</div>
            </div>
            
            <div className="divide-y divide-slate-200">
              {[
                { id: '1', title: 'Welcome to the community - Please read first', author: 'Admin', replies: 45, views: 1200, lastPost: '2 hours ago', isPinned: true },
                { id: '2', title: 'Community guidelines and rules', author: 'Moderator', replies: 12, views: 890, lastPost: '1 day ago', isPinned: true },
                { id: '3', title: 'How do I get started with the platform?', author: 'NewUser123', replies: 8, views: 234, lastPost: '30 min ago' },
              ].map((topic) => (
                <div key={topic.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 items-center">
                  <div className="col-span-7 flex items-start gap-3">
                    <div className="mt-1">
                      {topic.isPinned && <Badge variant="primary" className="text-xs">Pinned</Badge>}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 hover:text-[#2563EB] cursor-pointer">
                        {topic.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <span>{topic.author}</span>
                        <span>•</span>
                        <span>{topic.views} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-slate-600">{topic.replies}</div>
                  <div className="col-span-3 text-sm text-slate-600">{topic.lastPost}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </div>
            <p className="text-sm text-slate-600">Page 1 of 12</p>
          </div>
        </main>
      </div>
    </>
  );
}
