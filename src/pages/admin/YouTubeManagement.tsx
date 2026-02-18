import { useEffect, useState } from 'react';
import { Youtube, Trash2, Plus, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import type { YouTubeFeed, Visa } from '../../types/database';

export function YouTubeManagement() {
  const [feeds, setFeeds] = useState<YouTubeFeed[]>([]);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    thumbnail_url: '',
    channel_name: '',
    visa_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [feedsRes, visasRes] = await Promise.all([
        supabase.from('youtube_feeds').select('*').order('created_at', { ascending: false }),
        supabase.from('visas').select('id, subclass, name').eq('is_active', true).order('subclass')
      ]);

      if (feedsRes.error) throw feedsRes.error;
      if (visasRes.error) throw visasRes.error;

      setFeeds(feedsRes.data || []);
      setVisas(visasRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.title || !formData.youtube_url || !formData.channel_name) {
        toast('error', 'Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      let thumbUrl = formData.thumbnail_url;
      if (!thumbUrl && formData.youtube_url) {
        const videoIdMatch = formData.youtube_url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
          thumbUrl = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
        }
      }

      const { data, error } = await supabase.from('youtube_feeds').insert({
        title: formData.title,
        youtube_url: formData.youtube_url,
        thumbnail_url: thumbUrl || null,
        channel_name: formData.channel_name,
        visa_id: formData.visa_id || null
      }).select().single();

      if (error) throw error;

      setFeeds([data, ...feeds]);
      setFormData({
        title: '',
        youtube_url: '',
        thumbnail_url: '',
        channel_name: '',
        visa_id: ''
      });
      toast('success', 'Video added successfully');
    } catch (error) {
      console.error('Error adding video:', error);
      toast('error', 'Failed to add video');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase.from('youtube_feeds').delete().eq('id', id);
      if (error) throw error;

      setFeeds(feeds.filter(f => f.id !== id));
      toast('success', 'Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast('error', 'Failed to delete video');
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">YouTube Feed Management</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Add and manage trending immigration videos.</p>
      </div>

      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Add New Video</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Video Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g. How to Apply for Partner Visa"
              />
              <Input
                label="Channel Name"
                value={formData.channel_name}
                onChange={e => setFormData({ ...formData, channel_name: e.target.value })}
                required
                placeholder="e.g. Aussie Immigration"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="YouTube URL"
                value={formData.youtube_url}
                onChange={e => setFormData({ ...formData, youtube_url: e.target.value })}
                required
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <Input
                label="Thumbnail URL (Optional)"
                value={formData.thumbnail_url}
                onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="Auto-generated if left blank"
                helperText="Will attempt to fetch maxresdefault from YouTube if empty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Related Visa (Optional)
              </label>
              <select
                className="input-field"
                value={formData.visa_id}
                onChange={e => setFormData({ ...formData, visa_id: e.target.value })}
              >
                <option value="">Select a Visa...</option>
                {visas.map(visa => (
                  <option key={visa.id} value={visa.id}>
                    {visa.subclass} - {visa.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeds.map(feed => (
          <Card key={feed.id} className="overflow-hidden group h-full flex flex-col">
            <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800">
              {feed.thumbnail_url ? (
                <img
                  src={feed.thumbnail_url}
                  alt={feed.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Youtube className="w-12 h-12 text-neutral-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <CardBody className="flex flex-col flex-grow">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2" title={feed.title}>
                {feed.title}
              </h3>
              <div className="flex flex-col flex-grow justify-between">
                 <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  <p className="font-medium text-primary-600 dark:text-primary-400">{feed.channel_name}</p>
                  {feed.visa_id && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs border border-neutral-200 dark:border-neutral-700">
                      {visas.find(v => v.id === feed.visa_id)?.subclass}
                    </span>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <a
                    href={feed.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors text-neutral-500 hover:text-primary-600"
                    title="Open on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(feed.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors text-neutral-500 hover:text-red-600"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
