import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Files, PenTool, FileText, BookOpen, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';

export function ContentV2() {
  const [stats, setStats] = useState({
    pages: 12,
    posts: 24,
    news: 8,
    guides: 15,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock fetch - in real app would query database
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error('Failed to load stats:', error);
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
      icon: FileText,
      title: 'News Articles',
      count: stats.news,
      description: 'Immigration news and updates',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      to: '/admin/guides',
      icon: BookOpen,
      title: 'Visa Guides',
      count: stats.guides,
      description: 'Premium visa guides and content',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const recentContent = [
    { id: '1', title: 'Partner Visa Guide 2024', type: 'Guide', status: 'published', updatedAt: '2024-03-20' },
    { id: '2', title: 'New Immigration Rules', type: 'News', status: 'published', updatedAt: '2024-03-18' },
    { id: '3', title: 'How to Choose a Lawyer', type: 'Blog', status: 'draft', updatedAt: '2024-03-15' },
    { id: '4', title: 'Privacy Policy Update', type: 'Page', status: 'published', updatedAt: '2024-03-10' },
  ];

  return (
    <>
      <Helmet>
        <title>Content Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Content Management</h1>
                <p className="text-slate-600">Manage website content and resources</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Modules Grid - SQUARE */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {modules.map((module) => (
              <Link
                key={module.title}
                to={module.to}
                className="bg-white border border-slate-200 p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${module.color} flex items-center justify-center`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary">{loading ? '-' : module.count}</Badge>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1">{module.title}</h3>
                <p className="text-sm text-slate-600">{module.description}</p>
              </Link>
            ))}
          </div>

          {/* Recent Content - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Content</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Title</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Updated</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentContent.map((content) => (
                    <tr key={content.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{content.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary">{content.type}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={content.status === 'published' ? 'success' : 'warning'}>
                          {content.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{content.updatedAt}</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
