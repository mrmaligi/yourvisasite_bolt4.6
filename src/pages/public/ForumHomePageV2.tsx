import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, TrendingUp, Plus, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import type { ForumTopic, ForumCategory } from '../../types/database';

interface RecentTopic extends Omit<ForumTopic, 'author'> {
  category?: ForumCategory;
  author?: {
    full_name: string;
  };
}

export function ForumHomePageV2() {
  const [stats, setStats] = useState({
    topics: 0,
    replies: 0,
    users: 0,
  });
  const [recentTopics, setRecentTopics] = useState<RecentTopic[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentTopics();
    fetchCategories();
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

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('forum_categories')
      .select('*')
      .order('name');
    
    setCategories(data || []);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      <Helmet>
        <title>Community Forum | VisaBuild</title>
        <meta name="description" content="Connect with fellow visa applicants and immigration experts." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <Badge variant="primary" className="bg-blue-600">Community</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Community Forum</h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Connect with fellow visa applicants, share experiences, and get advice from our community.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-slate-600">Topics</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.topics.toLocaleString()}</div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-slate-600">Replies</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.replies.toLocaleString()}</div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-slate-600">Members</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.users.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Categories - SQUARE */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Categories</h2>
                
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/forum/${cat.slug}`}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    >
                      <span className="font-medium text-slate-700">{cat.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </Link>
                  ))}
                </div>

                <Link to="/forum/general">
                  <Button variant="primary" className="w-full mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    New Topic
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Topics - SQUARE */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Discussions</h2>
                
                {recentTopics.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No topics yet. Be the first to start a discussion!
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {recentTopics.map((topic) => (
                      <Link
                        key={topic.id}
                        to={`/forum/topic/${topic.id}`}
                        className="block py-4 hover:bg-slate-50 transition-colors -mx-6 px-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900 mb-1">{topic.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                              <Badge variant="secondary" className="text-xs">
                                {topic.category?.name}
                              </Badge>
                              <span>{topic.author?.full_name || 'Anonymous'}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(topic.last_reply_at || topic.created_at)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-slate-500">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">{topic.replies_count || 0}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
