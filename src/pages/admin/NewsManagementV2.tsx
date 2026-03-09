import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, ExternalLink, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  views: number;
}

const MOCK_ARTICLES: NewsArticle[] = [
  { id: '1', title: 'New Immigration Rules for 2024', category: 'Policy', isPublished: true, createdAt: '2024-03-20', views: 1250 },
  { id: '2', title: 'Partner Visa Processing Times Update', category: 'Visa Updates', isPublished: true, createdAt: '2024-03-18', views: 890 },
  { id: '3', title: 'Skilled Occupation List Changes', category: 'Policy', isPublished: false, createdAt: '2024-03-15', views: 0 },
];

export function NewsManagementV2() {
  const [articles] = useState<NewsArticle[]>(MOCK_ARTICLES);

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.isPublished).length,
    draft: articles.filter(a => !a.isPublished).length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
  };

  const getStatusBadge = (isPublished: boolean) => {
    return isPublished ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Draft</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Policy': 'bg-blue-100 text-blue-700',
      'Visa Updates': 'bg-green-100 text-green-700',
      'General': 'bg-slate-100 text-slate-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium ${colors[category] || 'bg-slate-100 text-slate-700'}`}>
        {category}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>News Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">News Management</h1>
                <p className="text-slate-600">Manage immigration news and updates</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Articles', value: stats.total, icon: FileText },
              { label: 'Published', value: stats.published, icon: ExternalLink },
              { label: 'Drafts', value: stats.draft, icon: FileText },
              { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: ExternalLink },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Articles Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Title</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Views</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Created</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{article.title}</p>
                      </td>
                      <td className="px-6 py-4">{getCategoryBadge(article.category)}</td>
                      <td className="px-6 py-4">{getStatusBadge(article.isPublished)}</td>
                      <td className="px-6 py-4 text-slate-700">{article.views.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-600">{article.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
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
