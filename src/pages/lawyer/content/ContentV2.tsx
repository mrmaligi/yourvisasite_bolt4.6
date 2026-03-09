import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Article {
  id: string;
  title: string;
  status: 'published' | 'draft';
  views: number;
  date: string;
}

const MOCK_ARTICLES: Article[] = [
  { id: '1', title: '5 Tips for Partner Visa Applicants', status: 'published', views: 150, date: '2023-11-15' },
  { id: '2', title: 'Changes to Skilled Migration 2024', status: 'draft', views: 0, date: '2023-11-28' },
  { id: '3', title: 'Student Visa Guide', status: 'published', views: 89, date: '2023-11-10' },
];

export function ContentV2() {
  const [articles] = useState<Article[]>(MOCK_ARTICLES);

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
  };

  return (
    <>
      <Helmet>
        <title>Content Marketing | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Content Marketing</h1>
                <p className="text-slate-600">Write articles to demonstrate expertise</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Write Article
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total },
              { label: 'Published', value: stats.published },
              { label: 'Drafts', value: stats.drafts },
              { label: 'Total Views', value: stats.totalViews },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{article.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={article.status === 'published' ? 'success' : 'secondary'}>
                          {article.status}
                        </Badge>
                        <span className="text-sm text-slate-500">{article.views} views • {article.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
