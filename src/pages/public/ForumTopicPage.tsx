import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, MessageSquare, Heart, Share2, Bell } from 'lucide-react';
import { ForumReplyComponent } from '../../components/forum/ForumReply';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { ForumTopic, ForumReply, ForumCategory } from '../../types/database';

interface ReplyWithAuthor extends ForumReply {
  author?: {
    full_name: string;
    avatar_url?: string;
  };
  user_vote?: boolean;
}

export function ForumTopicPage() {
  const { categorySlug, topicSlug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [topic, setTopic] = useState<(ForumTopic & { author?: { full_name: string } }) | null>(null);
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [replies, setReplies] = useState<ReplyWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchTopicData();
    if (user) checkSubscription();
  }, [topicSlug, user]);

  const fetchTopicData = async () => {
    try {
      // Get topic with author
      const { data: topicData } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:profiles(full_name)
        `)
        .eq('slug', topicSlug)
        .single();

      if (!topicData) return;
      setTopic(topicData);

      // Get category
      const { data: catData } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('id', topicData.category_id)
        .single();

      setCategory(catData);

      // Get replies
      const { data: repliesData } = await supabase
        .from('forum_replies')
        .select(`
          *,
          author:profiles(full_name, avatar_url)
        `)
        .eq('topic_id', topicData.id)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      setReplies(repliesData || []);

      // Increment view count
      await supabase
        .from('forum_topics')
        .update({ view_count: (topicData.view_count || 0) + 1 })
        .eq('id', topicData.id);

    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!user || !topic) return;
    
    const { data } = await supabase
      .from('forum_subscriptions')
      .select('*')
      .eq('topic_id', topic.id)
      .eq('user_id', user.id)
      .single();

    setIsSubscribed(!!data);
  };

  const handleReply = async () => {
    if (!user) {
      toast.error('Please sign in to reply');
      return;
    }
    if (!replyContent.trim()) return;

    try {
      const { error } = await supabase
        .from('forum_replies')
        .insert({
          topic_id: topic?.id,
          author_id: user.id,
          content: replyContent,
          parent_id: replyingTo,
        });

      if (error) throw error;

      toast.success('Reply posted!');
      setReplyContent('');
      setReplyingTo(null);
      fetchTopicData();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  const handleMarkSolution = async (replyId: string) => {
    try {
      // Unmark any existing solution
      await supabase
        .from('forum_replies')
        .update({ is_solution: false })
        .eq('topic_id', topic?.id);

      // Mark new solution
      await supabase
        .from('forum_replies')
        .update({ is_solution: true })
        .eq('id', replyId);

      toast.success('Marked as solution!');
      fetchTopicData();
    } catch (error) {
      console.error('Error marking solution:', error);
      toast.error('Failed to mark solution');
    }
  };

  const toggleSubscription = async () => {
    if (!user || !topic) return;

    try {
      if (isSubscribed) {
        await supabase
          .from('forum_subscriptions')
          .delete()
          .eq('topic_id', topic.id)
          .eq('user_id', user.id);
        setIsSubscribed(false);
        toast.success('Unsubscribed');
      } else {
        await supabase
          .from('forum_subscriptions')
          .insert({ topic_id: topic.id, user_id: user.id });
        setIsSubscribed(true);
        toast.success('Subscribed to notifications');
      }
    } catch (error) {
      toast.error('Failed to update subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="animate-pulse h-40" />
          <Card className="animate-pulse h-32" />
          <Card className="animate-pulse h-32" />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Topic not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          <Link to="/forum" className="hover:text-neutral-900 dark:hover:text-white">
            Forum
          </Link>
          <span>/</span>
          <Link to={`/forum/${categorySlug}`} className="hover:text-neutral-900 dark:hover:text-white">
            {category?.name}
          </Link>
        </div>

        {/* Topic Header */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {topic.title}
            </h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <span>by {topic.author?.full_name}</span>
                <span>•</span>
                <span>{new Date(topic.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {topic.view_count} views
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleSubscription}
                  className={isSubscribed ? 'text-primary-600' : ''}
                >
                  <Bell className="w-4 h-4 mr-1" />
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
                <Button variant="secondary" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Replies */}
        <div className="space-y-4 mb-8">
          {replies.map((reply) => (
            <ForumReplyComponent
              key={reply.id}
              reply={reply}
              isOp={user?.id === topic.author_id}
              onReply={setReplyingTo}
              onMarkSolution={handleMarkSolution}
            />
          ))}
        </div>

        {/* Reply Form */}
        <Card>
          <CardBody className="p-6">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
              {replyingTo ? 'Reply to comment' : 'Post a reply'}
            </h3>
            <Textarea
              placeholder="Share your thoughts..."
              rows={4}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              {replyingTo && (
                <Button variant="secondary" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleReply} disabled={!replyContent.trim()}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Post Reply
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
