import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Files, PenTool, FileText, BookOpen } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

export function Content() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    pages: 0,
    posts: 0,
    news: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pagesRes, postsRes, newsRes] = await Promise.all([
        supabase.from('cms_pages').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('news_articles').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        pages: pagesRes.count || 0,
        posts: postsRes.count || 0,
        news: newsRes.count || 0,
      });
    } catch (error) {
      toast('error', 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {
      to: '/admin/pages',
      icon: Files,
      title: 'CMS Pages',
      count: stats.pages,
      description: 'Static pages like About, Privacy, Terms',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      to: '/admin/blog',
      icon: PenTool,
      title: 'Blog Posts',
      count: stats.posts,
      description: 'Articles and blog content',
      color: 'bg-green-100 text-green-600',
    },
    {
      to: '/admin/news',
      icon: BookOpen,
      title: 'News Articles',
      count: stats.news,
      description: 'Visa news and updates',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Content Management</h1>
        <p className="text-neutral-500 mt-1">Manage all platform content</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link key={module.to} to={module.to}>
            <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
              <CardBody className="flex items-center gap-4 p-6">
                <div className={`w-14 h-14 ${module.color} rounded-xl flex items-center justify-center`}>
                  <module.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-500">{module.description}</p>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {loading ? '--' : module.count}
                  </h3>
                  <p className="font-medium">{module.title}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <Card>
        <CardBody className="p-6">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/pages">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                New Page
              </Button>
            </Link>
            <Link to="/admin/blog">
              <Button variant="outline" className="w-full">
                <PenTool className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </Link>
            <Link to="/admin/news">
              <Button variant="outline" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
