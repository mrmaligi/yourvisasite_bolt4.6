import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { User, Clock, Share2, Flag, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isOriginalPoster?: boolean;
}

const posts: Post[] = [
  {
    id: '1',
    author: 'TechEnthusiast',
    avatar: 'TE',
    content: 'I have been trying to integrate the new API but keep getting 404 errors. Has anyone else experienced this? I have checked the documentation but cannot find any reference to the endpoint I need.',
    timestamp: '2 hours ago',
    isOriginalPoster: true,
  },
  {
    id: '2',
    author: 'DevHelper',
    avatar: 'DH',
    content: 'The endpoint was changed in the last update. Try using /api/v2/ instead of /api/v1/. The documentation has not been updated yet.',
    timestamp: '1 hour ago',
  },
];

export function ForumTopicPageV2() {
  const [reply, setReply] = useState('');

  return (
    <>
      <Helmet>
        <title>API Integration Help | VisaBuild Forum</title>
        <meta name="description" content="Discussion thread about API integration." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <Link to="/forum" className="hover:text-[#2563EB]">Forum</Link>
              <span>/</span>
              <Link to="/forum/general" className="hover:text-[#2563EB]">General Discussion</Link>
              <span>/</span>
              <span className="text-slate-900">API Integration Help</span>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900">API Integration Help</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
              <span>Started by TechEnthusiast</span>
              <span>•</span>
              <span>15 replies</span>
              <span>•</span>
              <span>234 views</span>
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-6 bg-slate-50">
                    <div className="w-12 h-12 bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg mb-3">
                      {post.avatar}
                    </div>
                    <h3 className="font-semibold text-slate-900">{post.author}</h3>
                    {post.isOriginalPoster && (
                      <Badge variant="primary" className="mt-2 text-xs">OP</Badge>
                    )}
                    <p className="mt-2 text-sm text-slate-500">Member since 2023</p>
                    <p className="text-sm text-slate-500">342 posts</p>
                  </div>
                  
                  <div className="md:col-span-3 p-6">
                    <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.timestamp}</span>
                      </div>
                      <div className="flex gap-3">
                        <button aria-label="Reply to post" title="Reply to post" className="hover:text-[#2563EB] transition-colors"><MessageSquare className="w-4 h-4" /></button>
                        <button aria-label="Share post" title="Share post" className="hover:text-[#2563EB] transition-colors"><Share2 className="w-4 h-4" /></button>
                        <button aria-label="Report post" title="Report post" className="hover:text-red-600 transition-colors"><Flag className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="text-slate-700 leading-relaxed">{post.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Post Reply</h3>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply..."
              className="w-full p-4 border border-slate-300 min-h-[150px] focus:outline-none focus:border-[#2563EB]"
            />
            <div className="mt-4 flex justify-end">
              <Button variant="primary">Submit Reply</Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
