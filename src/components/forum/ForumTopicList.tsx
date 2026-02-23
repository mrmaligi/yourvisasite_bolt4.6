import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageSquare, Eye, Pin, Lock, User, Clock } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { supabase } from '../../lib/supabase';
import type { ForumTopic } from '../../types/database';

interface TopicWithAuthor extends Omit<ForumTopic, 'author'> {
  author?: {
    full_name: string;
    avatar_url?: string;
  };
  last_reply_by_user?: {
    full_name: string;
  };
}

export function ForumTopicList() {
  const { categorySlug } = useParams();
  const [topics, setTopics] = useState<TopicWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // Get category
        const { data: cat } = await supabase
          .from('forum_categories')
          .select('*')
          .eq('slug', categorySlug)
          .single();

        if (!cat) return;

        // Get topics with authors
        const { data: topicsData } = await supabase
          .from('forum_topics')
          .select(`
            *,
            author:profiles(full_name, avatar_url),
            last_reply_by_user:last_reply_by(full_name)
          `)
          .eq('category_id', cat.id)
          .order('is_pinned', { ascending: false })
          .order('last_reply_at', { ascending: false });

        setTopics(topicsData || []);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchTopics();
    }
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardBody className="h-20">
              <div className="h-full bg-neutral-200 dark:bg-neutral-700 rounded" />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              No topics yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              Be the first to start a discussion!
            </p>
          </CardBody>
        </Card>
      ) : (
        topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/forum/${categorySlug}/${topic.slug}`}
            className="block"
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardBody className="flex items-start gap-4">
                {/* Author Avatar */}
                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                  {topic.author?.avatar_url ? (
                    <img
                      src={topic.author.avatar_url}
                      alt={topic.author.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-neutral-500" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {topic.is_pinned && (
                      <Badge variant="primary">
                        <Pin className="w-3 h-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                    {topic.is_locked && (
                      <Badge variant="secondary">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                    <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 transition-colors">
                      {topic.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <span>{topic.author?.full_name || 'Unknown'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(topic.created_at).toLocaleDateString()}
                    </span>
                    {topic.last_reply_at && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Last reply by {topic.last_reply_by_user?.full_name || 'Unknown'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {topic.replies_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {topic.view_count}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
