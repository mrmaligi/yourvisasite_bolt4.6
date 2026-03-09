import { Folder, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CategoriesV2() {
  const categories = [
    { id: 1, name: 'Partner Visas', slug: 'partner-visas', articles: 12 },
    { id: 2, name: 'Skilled Migration', slug: 'skilled-migration', articles: 8 },
    { id: 3, name: 'Student Visas', slug: 'student-visas', articles: 6 },
    { id: 4, name: 'Work Visas', slug: 'work-visas', articles: 10 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
            <p className="text-slate-600">Manage content categories</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Slug</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Articles</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{cat.slug}</td>
                    <td className="px-6 py-4 text-slate-700">{cat.articles}</td>
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
    </div>
  );
}
