import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckSquare, Download, FileText, Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const CHECKLISTS = [
  { id: 1, title: 'Visa Application Checklist', category: 'General', pages: 4 },
  { id: 2, title: 'Document Gathering Checklist', category: 'General', pages: 3 },
  { id: 3, title: 'Medical Examination Checklist', category: 'Health', pages: 2 },
  { id: 4, title: 'Character Assessment Checklist', category: 'Character', pages: 5 },
  { id: 5, title: 'English Language Test Checklist', category: 'Language', pages: 1 },
];

const CATEGORIES = ['All', 'General', 'Health', 'Character', 'Language'];

export function ChecklistsV2() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredChecklists = CHECKLISTS.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Document Checklists | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-blue-50 border-b border-blue-200 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-white flex items-center justify-center mx-auto mb-6">
              <CheckSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Document Checklists</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Ensure your application is decision-ready with our comprehensive checklists.
              Missing documents are the #1 cause of visa delays.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white border border-slate-200 p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search checklists..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200"
                />
              </div>
              
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChecklists.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <Badge variant="secondary">{item.pages} Pages</Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-4">Category: {item.category}</p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  
                  <Button variant="primary" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
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
