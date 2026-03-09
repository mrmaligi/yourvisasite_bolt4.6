import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Folder, FileText, Upload, CheckCircle, Clock, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'uploaded' | 'verified';
  folder: string;
  uploadedAt?: string;
}

const MOCK_DOCS: Document[] = [
  { id: '1', name: 'Passport.pdf', status: 'verified', folder: 'Identity', uploadedAt: '2024-03-20' },
  { id: '2', name: 'Bank_Statements.pdf', status: 'uploaded', folder: 'Financial', uploadedAt: '2024-03-19' },
  { id: '3', name: 'Employment_Letter.pdf', status: 'pending', folder: 'Employment' },
  { id: '4', name: 'Marriage_Certificate.pdf', status: 'verified', folder: 'Relationship', uploadedAt: '2024-03-18' },
];

const FOLDERS = ['Identity', 'Financial', 'Employment', 'Relationship'];

export function DocumentDashboardV2() {
  const [documents] = useState<Document[]>(MOCK_DOCS);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || d.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const stats = {
    total: documents.length,
    verified: documents.filter(d => d.status === 'verified').length,
    uploaded: documents.filter(d => d.status === 'uploaded').length,
    pending: documents.filter(d => d.status === 'pending').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'secondary'> = {
      verified: 'success',
      uploaded: 'warning',
      pending: 'secondary',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Document Dashboard | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Document Dashboard</h1>
                <p className="text-slate-600">Manage client documents and requirements</p>
              </div>
              <Button variant="primary">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: FileText },
              { label: 'Verified', value: stats.verified, icon: CheckCircle, color: 'text-green-600' },
              { label: 'Uploaded', value: stats.uploaded, icon: Upload, color: 'text-yellow-600' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-slate-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200"
                />
              </div>
              
              <select 
                value={selectedFolder} 
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="px-3 py-2 border border-slate-200"
              >
                <option value="all">All Folders</option>
                {FOLDERS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FOLDERS.map((folder) => {
              const folderDocs = filteredDocs.filter(d => d.folder === folder);
              if (folderDocs.length === 0 && selectedFolder !== 'all' && selectedFolder !== folder) return null;
              
              return (
                <div key={folder} className="bg-white border border-slate-200">
                  <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-yellow-500" />
                    <h2 className="font-semibold text-slate-900">{folder}</h2>
                    <span className="text-sm text-slate-500">({folderDocs.length})</span>
                  </div>
                  
                  <div className="divide-y divide-slate-200">
                    {folderDocs.map((doc) => (
                      <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">{doc.name}</p>
                            {doc.uploadedAt && <p className="text-sm text-slate-500">{doc.uploadedAt}</p>}
                          </div>
                        </div>
                        
                        {getStatusBadge(doc.status)}
                      </div>
                    ))}
                    
                    {folderDocs.length === 0 && (
                      <div className="p-4 text-center text-slate-500">No documents</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
