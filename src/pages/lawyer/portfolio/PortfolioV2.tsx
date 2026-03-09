import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
}

const MOCK_ITEMS: PortfolioItem[] = [
  { id: '1', title: 'Global Talent Visa Case', description: 'Secured visa for software engineer in 3 weeks', category: 'Skilled Migration', year: '2023' },
  { id: '2', title: 'Family Reunification', description: 'Successfully navigated complex health waiver', category: 'Family', year: '2023' },
  { id: '3', title: 'Business Visa Application', description: 'Helped entrepreneur establish business in Australia', category: 'Business', year: '2022' },
];

export function PortfolioV2() {
  const [items] = useState<PortfolioItem[]>(MOCK_ITEMS);
  const [showForm, setShowForm] = useState(false);

  const stats = {
    total: items.length,
    categories: new Set(items.map(i => i.category)).size,
  };

  return (
    <>
      <Helmet>
        <title>Portfolio | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Portfolio</h1>
                <p className="text-slate-600">Showcase your case studies</p>
              </div>
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Case
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  <p className="text-sm text-slate-600">Case Studies</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.categories}</p>
                  <p className="text-sm text-slate-600">Categories</p>
                </div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="bg-white border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Case Study</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Title" className="w-full px-3 py-2 border border-slate-200" />
                <textarea placeholder="Description" rows={3} className="w-full px-3 py-2 border border-slate-200" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Category" className="px-3 py-2 border border-slate-200" />
                  <input type="text" placeholder="Year" className="px-3 py-2 border border-slate-200" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="primary">Save</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span className="text-sm text-slate-500">{item.year}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 mt-1">{item.description}</p>
                  </div>
                  
                  <Button variant="danger" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
