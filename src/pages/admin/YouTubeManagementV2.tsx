import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Youtube, Trash2, Plus, ExternalLink, Play } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  views: string;
  addedAt: string;
}

const MOCK_VIDEOS: YouTubeVideo[] = [
  { id: '1', title: 'Partner Visa Guide 2024', channel: 'VisaBuild', thumbnail: '', views: '12K', addedAt: '2024-03-20' },
  { id: '2', title: 'Skilled Migration Explained', channel: 'Immigration Expert', thumbnail: '', views: '8.5K', addedAt: '2024-03-18' },
  { id: '3', title: 'Student Visa Tips', channel: 'VisaBuild', thumbnail: '', views: '5K', addedAt: '2024-03-15' },
];

export function YouTubeManagementV2() {
  const [videos] = useState<YouTubeVideo[]>(MOCK_VIDEOS);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    channel: '',
  });

  return (
    <>
      <Helmet>
        <title>YouTube Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">YouTube Management</h1>
                <p className="text-slate-600">Manage embedded YouTube videos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Add New Video</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Video Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Channel Name</label>
                  <input
                    type="text"
                    value={formData.channel}
                    onChange={(e) => setFormData({...formData, channel: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Stats</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200">
                  <p className="text-2xl font-bold text-slate-900">{videos.length}</p>
                  <p className="text-sm text-slate-600">Total Videos</p>
                </div>
                
                <div className="p-4 bg-slate-50 border border-slate-200">
                  <p className="text-2xl font-bold text-slate-900">25.5K</p>
                  <p className="text-sm text-slate-600">Total Views</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Videos</h2>
            </div>
            
            <div className="divide-y divide-slate-200">
              {videos.map((video) => (
                <div key={video.id} className="flex items-center gap-4 p-4 hover:bg-slate-50">
                  <div className="w-16 h-12 bg-slate-200 flex items-center justify-center">
                    <Play className="w-6 h-6 text-slate-400" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{video.title}</p>
                    <p className="text-sm text-slate-500">{video.channel} • {video.views} views</p>
                  </div>
                  
                  <span className="text-sm text-slate-500">{video.addedAt}</span>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
