import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Download, Star, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const TEMPLATES = [
  { id: 1, title: 'Statutory Declaration Template', category: 'General', format: 'DOCX' },
  { id: 2, title: 'Employment Reference Letter Template', category: 'Work', format: 'DOCX' },
  { id: 3, title: 'Visa Resume/CV Template', category: 'Skilled', format: 'DOCX' },
  { id: 4, title: 'Sponsorship Letter Template', category: 'Family', format: 'DOCX' },
  { id: 5, title: 'Relationship Statement Template', category: 'Partner', format: 'DOCX' },
];

const CATEGORIES = ['All', 'General', 'Work', 'Skilled', 'Family', 'Partner'];

export function TemplatesV2() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Document Templates | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Document Templates</h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Save time and avoid errors with our lawyer-approved document templates.
              Ready to edit and submit.
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
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
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
            {filteredTemplates.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <Badge variant="secondary">{item.format}</Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-4">Category: {item.category}</p>

                <Button variant="primary" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
