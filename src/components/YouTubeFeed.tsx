import { useEffect, useState } from 'react';
import { Youtube } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Card, CardBody } from './ui/Card';
import type { YouTubeFeed as YouTubeFeedType } from '../types/database';

export function YouTubeFeed() {
  const [feeds, setFeeds] = useState<YouTubeFeedType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeeds() {
      try {
        const { data, error } = await supabase
          .from('youtube_feeds')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        setFeeds(data || []);
      } catch (error) {
        console.error('Error fetching YouTube feeds:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeeds();
  }, []);

  const getYoutubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match ? match[1] : null;
  };

  if (loading) return null;
  if (feeds.length === 0) return null;

  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Youtube className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Trending Immigration Videos</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feeds.map((feed) => {
            const videoId = getYoutubeVideoId(feed.youtube_url);

            return (
              <Card key={feed.id} className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={feed.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Youtube className="w-12 h-12 text-neutral-300" />
                    </div>
                  )}
                </div>
                <CardBody className="p-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2">
                    {feed.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {feed.channel_name}
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
