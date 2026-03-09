import { FileText, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ArticlesV2() {
  const articles = [
    { id: 1, title: 'Understanding Partner Visas', author: 'Jane Smith', status: 'published', date: '2024-03-20', views: 1250 },
    { id: 2, title: 'Skilled Migration Guide', author: 'John Doe', status: 'draft', date: '2024-03-18', views: 0 },
    { id: 3, title: 'Student Visa Requirements', author: 'Jane Smith', status: 'published', date: '2024-03-15', views: 890 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
            <p className="text-slate-600">Manage content articles</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>

        <div className="bg-white border border-slate-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search articles..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Author</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Views</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{article.title}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{article.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{article.date}</td>
                  <td className="px-6 py-4 text-right text-slate-700">{article.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
