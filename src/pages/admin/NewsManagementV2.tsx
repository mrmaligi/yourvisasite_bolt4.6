import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, ExternalLink, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

const MOCK_ARTICLES: NewsArticle[] = [
  { id: '1', title: 'New Immigration Rules for 2024', excerpt: 'Changes to skilled migration...', category: 'Policy', isPublished: true, createdAt: '2024-03-20' },
  { id: '2', title: 'Partner Visa Processing Update', excerpt: 'Processing times reduced...', category: 'News', isPublished: true, createdAt: '2024-03-18' },
  { id: '3', title: 'Student Visa Changes', excerpt: 'New work rights announced...', category: 'Education', isPublished: false, createdAt: '2024-03-15' },
];

export function NewsManagementV2() {
  const [articles] = useState<NewsArticle[]>(MOCK_ARTICLES);
  const [search, setSearch] = useState('');

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.isPublished).length,
    draft: articles.filter(a => !a.isPublished).length,
  };

  return (
    <>
      <Helmet>
        <title>News Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">News Management</h1>
                <p className="text-slate-600">Manage immigration news articles</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Articles', value: stats.total },
              { label: 'Published', value: stats.published, color: 'text-green-600' },
              { label: 'Drafts', value: stats.draft, color: 'text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className={`text-2xl font-bold ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Title</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Created</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{article.title}</p>
                          <p className="text-sm text-slate-500">{article.excerpt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs">{article.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={article.isPublished ? 'success' : 'warning'}>
                          {article.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{article.createdAt}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
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
