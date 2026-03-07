import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, TrendingUp, Plus } from 'lucide-react';
import { ForumCategoryList } from '../../components/forum/ForumCategoryList';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import type { ForumTopic, ForumCategory } from '../../types/database';

interface RecentTopic extends Omit<ForumTopic, 'author'> {
  category?: ForumCategory;
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Hero */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-900/20 rounded-[4rem] blur-3xl"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20 mb-6 text-white transform hover:scale-105 transition-transform duration-300">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 tracking-tight">
            Community Forum
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Connect with fellow visa applicants, share experiences, and get advice 
            from our community and verified immigration lawyers.
          </p>
          <Link to="/forum/general">
            <div className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-1">
              <Plus className="w-5 h-5 mr-2" />
              Start a Discussion
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm text-center transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent dark:from-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-14 h-14 mx-auto bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="w-7 h-7" />
            </div>
            <p className="text-4xl font-extrabold text-neutral-900 dark:text-white mb-1">{stats.topics.toLocaleString()}</p>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Topics</p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm text-center transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-14 h-14 mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-7 h-7" />
            </div>
            <p className="text-4xl font-extrabold text-neutral-900 dark:text-white mb-1">{stats.replies.toLocaleString()}</p>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Replies</p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm text-center transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent dark:from-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-14 h-14 mx-auto bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
              <Users className="w-7 h-7" />
            </div>
            <p className="text-4xl font-extrabold text-neutral-900 dark:text-white mb-1">{stats.users.toLocaleString()}</p>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Members</p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-2 bg-indigo-500 rounded-full"></div>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
              Browse by Category
            </h2>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden p-6 md:p-8">
            <ForumCategoryList />
          </div>
        </div>

        {/* Recent Topics */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-2 bg-blue-500 rounded-full"></div>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
              Recent Discussions
            </h2>
          </div>
          <div className="space-y-4">
            {recentTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/forum/${topic.category?.slug}/${topic.slug}`}
                className="block group"
              >
                <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-800 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="pr-6">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {topic.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                        {topic.category?.name}
                      </span>
                      <span>•</span>
                      <span className="font-medium">by {topic.author?.full_name}</span>
                      <span>•</span>
                      <span>{new Date(topic.last_reply_at || topic.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-neutral-50 dark:bg-neutral-900 flex-shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                    <span className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{topic.replies_count}</span>
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Replies</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
