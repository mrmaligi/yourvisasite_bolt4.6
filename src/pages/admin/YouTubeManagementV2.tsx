import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Youtube, Plus, Play, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  views: string;
  addedAt: string;
}

const MOCK_VIDEOS: YouTubeVideo[] = [
  { id: '1', title: 'Partner Visa Guide 2024', channel: 'VisaBuild', views: '12.5K', addedAt: '2024-03-20' },
  { id: '2', title: 'Skilled Migration Explained', channel: 'VisaBuild', views: '8.2K', addedAt: '2024-03-15' },
];

export function YouTubeManagementV2() {
  const [videos] = useState<YouTubeVideo[]>(MOCK_VIDEOS);
  const [showForm, setShowForm] = useState(false);

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
                <p className="text-slate-600">Manage embedded videos</p>
              </div>
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showForm && (
            <div className="bg-white border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Add YouTube Video</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Video Title" className="px-3 py-2 border border-slate-200" />
                <input type="url" placeholder="YouTube URL" className="px-3 py-2 border border-slate-200" />
              </div>
              <div className="flex gap-2">
                <Button variant="primary">Add</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white border border-slate-200">
                <div className="aspect-video bg-slate-200 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{video.title}</h3>
                  <p className="text-sm text-slate-600">{video.channel}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="secondary">{video.views} views</Badge>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm"><ExternalLink className="w-4 h-4" /></Button>
                      <Button variant="danger" size="sm"><Trash2 className="w-4 h-4" /></Button>
                    </div>
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
