import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, TrendingUp, Plus } from 'lucide-react';
import { ForumCategoryList } from '../../components/forum/ForumCategoryList';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import type { ForumTopic } from '../../types/database';

interface RecentTopic extends ForumTopic {
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    full_name: string;
  };
}

export function ForumHomePage() {
  const [stats, setStats] = useState({
    topics: 0,
    replies: 0,
    users: 0,
  });
  const [recentTopics, setRecentTopics] = useState<RecentTopic[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentTopics();
  }, []);

  const fetchStats = async () => {
    const [{ count: topics }, { count: replies }, { count: users }] = await Promise.all([
      supabase.from('forum_topics').select('id', { count: 'exact' }),
      supabase.from('forum_replies').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }),
    ]);

    setStats({
      topics: topics || 0,
      replies: replies || 0,
      users: users || 0,
    });
  };

  const fetchRecentTopics = async () => {
    const { data } = await supabase
      .from('forum_topics')
      .select(`
        *,
        category:forum_categories(name, slug),
        author:profiles(full_name)
      `)
      .order('last_reply_at', { ascending: false })
      .limit(5);

    setRecentTopics(data || []);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Community Forum
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-6">
            Connect with fellow visa applicants, share experiences, and get advice 
            from our community and verified immigration lawyers.
          </p>
          <Link to="/forum/general">
            <Button className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Start a Discussion
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <Card>
            <CardBody className="text-center p-6">
              <MessageSquare className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.topics}</p>
              <p className="text-sm text-neutral-500">Topics</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center p-6">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.replies}</p>
              <p className="text-sm text-neutral-500">Replies</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center p-6">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.users}</p>
              <p className="text-sm text-neutral-500">Members</p>
            </CardBody>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            Browse by Category
          </h2>
          <ForumCategoryList />
        </div>

        {/* Recent Topics */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            Recent Discussions
          </h2>
          <div className="space-y-4">
            {recentTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/forum/${topic.category?.slug}/${topic.slug}`}
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardBody className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-neutral-500 mt-1">
                        in {topic.category?.name} • by {topic.author?.full_name} •{' '}
                        {new Date(topic.last_reply_at || topic.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-neutral-500">
                      {topic.replies_count} replies
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
