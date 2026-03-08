import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Upload, Folder, Search, MoreVertical, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: string;
}

const mockDocuments: Document[] = [
  { id: '1', name: 'Passport_Scan.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-03-01', category: 'Identity' },
  { id: '2', name: 'Degree_Certificate.pdf', type: 'PDF', size: '1.8 MB', uploadedAt: '2024-03-05', category: 'Education' },
  { id: '3', name: 'Employment_Letter.pdf', type: 'PDF', size: '856 KB', uploadedAt: '2024-03-08', category: 'Work' },
  { id: '4', name: 'Bank_Statement.pdf', type: 'PDF', size: '3.2 MB', uploadedAt: '2024-03-10', category: 'Financial' },
];

const categories = ['All', 'Identity', 'Education', 'Work', 'Financial'];

export function DocumentsV2() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = mockDocuments.filter(doc => {
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Documents | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                <p className="text-slate-600">Manage and organize your visa documents</p>
              </div>
              
              <Button variant="primary">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Documents', value: '24', icon: FileText },
              { label: 'Categories', value: '6', icon: Folder },
              { label: 'Storage Used', value: '156 MB', icon: Upload },
              { label: 'Pending Review', value: '3', icon: FileText },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeCategory === cat
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

          {/* Documents List - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-100 border-b border-slate-200 text-sm font-medium text-slate-700">
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Uploaded</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50">
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.type}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <Badge variant="secondary">{doc.category}</Badge>
                  </div>
                  
                  <div className="col-span-2 text-sm text-slate-600">{doc.size}</div>
                  <div className="col-span-2 text-sm text-slate-600">{doc.uploadedAt}</div>
                  
                  <div className="col-span-1 flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
