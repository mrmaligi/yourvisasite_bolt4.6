import { useEffect, useState } from 'react';
import { Youtube, Play } from 'lucide-react';
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
          {feeds.map((feed) => (
            <a
              key={feed.id}
              href={feed.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  {feed.thumbnail_url ? (
                    <img
                      src={feed.thumbnail_url}
                      alt={feed.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                         const videoIdMatch = feed.youtube_url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
                         if (videoIdMatch && videoIdMatch[1]) {
                           (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
                         }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Youtube className="w-12 h-12 text-neutral-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <CardBody className="p-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                    {feed.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {feed.channel_name}
                  </p>
                </CardBody>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
