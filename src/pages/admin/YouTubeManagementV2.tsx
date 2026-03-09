import { Video, Plus, Eye, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function YouTubeManagementV2() {
  const videos = [
    { id: 1, title: 'Partner Visa Explained', views: '12.5K', likes: 890, comments: 45, status: 'published' },
    { id: 2, title: 'Skilled Migration 2024', views: '8.2K', likes: 567, comments: 32, status: 'published' },
    { id: 3, title: 'Document Checklist Tips', views: '0', likes: 0, comments: 0, status: 'draft' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">YouTube Management</h1>
            <p className="text-slate-600">Manage your YouTube content</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Videos', value: '24' },
            { label: 'Total Views', value: '156K' },
            { label: 'Subscribers', value: '8,420' },
            { label: 'Watch Time', value: '12.5K hrs' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {videos.map((video) => (
              <div key={video.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-10 bg-slate-200 flex items-center justify-center">
                    <Video className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{video.title}</p>
                    <span className={`text-xs px-2 py-0.5 ${
                      video.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {video.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {video.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {video.comments}
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
