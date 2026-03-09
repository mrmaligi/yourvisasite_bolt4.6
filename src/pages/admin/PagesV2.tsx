import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Edit, Eye, Plus, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  updatedAt: string;
}

const MOCK_PAGES: Page[] = [
  { id: '1', title: 'About Us', slug: '/about', status: 'published', updatedAt: '2024-03-20' },
  { id: '2', title: 'Privacy Policy', slug: '/privacy', status: 'published', updatedAt: '2024-03-15' },
  { id: '3', title: 'Terms of Service', slug: '/terms', status: 'published', updatedAt: '2024-03-10' },
  { id: '4', title: 'Contact Page', slug: '/contact', status: 'draft', updatedAt: '2024-03-18' },
];

export function PagesV2() {
  const [pages] = useState<Page[]>(MOCK_PAGES);
  const [search, setSearch] = useState('');

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: pages.length,
    published: pages.filter(p => p.status === 'published').length,
    draft: pages.filter(p => p.status === 'draft').length,
  };

  return (
    <>
      <Helmet>
        <title>CMS Pages | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">CMS Pages</h1>
                <p className="text-slate-600">Manage static website pages</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Page
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Pages', value: stats.total },
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
                placeholder="Search pages..."
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
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Slug</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Updated</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{page.title}</td>
                      <td className="px-6 py-4 text-slate-600">{page.slug}</td>
                      <td className="px-6 py-4">
                        <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
                          {page.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{page.updatedAt}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm"><Trash2 className="w-4 h-4" /></Button>
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
