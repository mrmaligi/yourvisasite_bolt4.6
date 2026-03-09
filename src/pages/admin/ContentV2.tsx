import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Files, PenTool, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ContentV2() {
  const [stats] = useState({
    pages: 12,
    posts: 24,
    news: 8,
    guides: 15,
  });

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
      color: 'bg-purple-100 text-purple-600',
    },
    {
      to: '/admin/guides',
      icon: BookOpen,
      title: 'Visa Guides',
      count: stats.guides,
      description: 'Detailed visa application guides',
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Content Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Content Management</h1>
                <p className="text-slate-600">Manage your website content</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Link key={module.to} to={module.to}>
                <div className="bg-white border border-slate-200 p-6 hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${module.color} flex items-center justify-center`}>
                        <module.icon className="w-6 h-6" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-slate-900">{module.title}</h2>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-sm">
                            {module.count}
                          </span>
                        </div>
                        <p className="text-slate-600">{module.description}</p>
                      </div>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Content Tips</h3>
                <p className="text-blue-700">Keep your content fresh and up-to-date for better SEO</p>
              </div>
              <Button variant="outline">View Guidelines</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
