import { FileText, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminContentV2() {
  const pages = [
    { id: 1, title: 'Home', slug: '/', status: 'Published', lastModified: 'Mar 15, 2024' },
    { id: 2, title: 'About Us', slug: '/about', status: 'Published', lastModified: 'Mar 10, 2024' },
    { id: 3, title: 'Contact', slug: '/contact', status: 'Published', lastModified: 'Mar 5, 2024' },
    { id: 4, title: 'Services', slug: '/services', status: 'Draft', lastModified: 'Feb 28, 2024' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Content Management</h1>
            <p className="text-slate-400">Manage website pages</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search pages..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Page</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Slug</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Last Modified</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="p-4 font-medium">{page.title}</td>
                  <td className="p-4 text-slate-500">{page.slug}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      page.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{page.status}</span>
                  </td>
                  <td className="p-4">{page.lastModified}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
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
