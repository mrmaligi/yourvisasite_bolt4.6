import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Folder, FileText, Upload, Plus, Download, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface DocItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  updatedAt: string;
  category?: string;
}

const MOCK_DOCS: DocItem[] = [
  { id: '1', name: 'Client Visas', type: 'folder', updatedAt: '2024-03-20', category: 'folder' },
  { id: '2', name: 'Templates', type: 'folder', updatedAt: '2024-02-15', category: 'folder' },
  { id: '3', name: 'Invoices', type: 'folder', updatedAt: '2024-03-10', category: 'folder' },
  { id: '4', name: 'Guide - Partner Visa.pdf', type: 'file', size: '2.4 MB', updatedAt: '2024-03-18', category: 'pdf' },
  { id: '5', name: 'Checklist - 189 Visa.docx', type: 'file', size: '1.1 MB', updatedAt: '2024-03-12', category: 'doc' },
  { id: '6', name: 'Form 80 Template.pdf', type: 'file', size: '850 KB', updatedAt: '2024-03-05', category: 'pdf' },
];

export function DocumentsV2() {
  const [items] = useState<DocItem[]>(MOCK_DOCS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string, category?: string) => {
    if (type === 'folder') return <Folder className="w-8 h-8 text-blue-600" />;
    if (category === 'pdf') return <FileText className="w-8 h-8 text-red-600" />;
    return <FileText className="w-8 h-8 text-slate-600" />;
  };

  return (
    <>
      <Helmet>
        <title>Documents | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                <p className="text-slate-600">Manage and organize your files</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Folder
                </Button>
                <Button variant="primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & View Toggle - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 border ${viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 border ${viewMode === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'}`}
              >
                List
              </button>
            </div>
          </div>

          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Files', value: items.filter(i => i.type === 'file').length },
              { label: 'Folders', value: items.filter(i => i.type === 'folder').length },
              { label: 'PDFs', value: items.filter(i => i.category === 'pdf').length },
              { label: 'Storage', value: '45 MB' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Grid View - SQUARE */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 animate-pulse" />
                ))
              ) : (
                filteredItems.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 p-4 hover:border-blue-300 transition-colors group">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3">{getFileIcon(item.type, item.category)}</div>
                      <p className="text-sm font-medium text-slate-900 truncate w-full">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.size || item.updatedAt}</p>
                      
                      <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-slate-100"><Download className="w-4 h-4 text-slate-600" /></button>
                        <button className="p-1 hover:bg-slate-100"><Trash2 className="w-4 h-4 text-red-600" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* List View - SQUARE */
            <div className="bg-white border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Name</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Size</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Updated</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(item.type, item.category)}
                            <span className="font-medium text-slate-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={item.type === 'folder' ? 'primary' : 'secondary'}>
                            {item.type === 'folder' ? 'Folder' : item.category?.toUpperCase() || 'File'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.size || '-'}</td>
                        <td className="px-6 py-4 text-slate-600">{item.updatedAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline"><Download className="w-4 h-4" /></Button>
                            <Button size="sm" variant="danger"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
