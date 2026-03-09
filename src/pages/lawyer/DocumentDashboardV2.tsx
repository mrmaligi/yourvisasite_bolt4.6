import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Folder, FileText, Upload, CheckCircle, Clock, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const MOCK_FOLDERS = [
  {
    id: '1',
    name: 'Identity Documents',
    documents: [
      { id: 'd1', name: 'Passport', status: 'verified', date: '2024-03-20' },
      { id: 'd2', name: 'Driver License', status: 'pending', date: '2024-03-18' },
    ],
  },
  {
    id: '2',
    name: 'Financial Documents',
    documents: [
      { id: 'd3', name: 'Bank Statements', status: 'uploaded', date: '2024-03-15' },
      { id: 'd4', name: 'Tax Returns', status: 'pending', date: '-' },
    ],
  },
];

export function DocumentDashboardV2() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<any>(MOCK_FOLDERS[0]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge variant="success">Verified</Badge>;
      case 'uploaded': return <Badge variant="primary">Uploaded</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Document Dashboard | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Client
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Document Dashboard</h1>
                <p className="text-slate-600">Manage client documents and verification</p>
              </div>
              <Button variant="primary">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Folders Sidebar - SQUARE */}
            <div className="bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Folders</h2>
              </div>
              
              <div className="divide-y divide-slate-200">
                {MOCK_FOLDERS.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                      selectedFolder?.id === folder.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <Folder className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{folder.name}</p>
                      <p className="text-sm text-slate-500">{folder.documents.length} documents</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Documents List - SQUARE */}
            <div className="lg:col-span-3 bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">{selectedFolder?.name}</h2>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 border border-slate-200 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              
              <div className="divide-y divide-slate-200">
                {selectedFolder?.documents.map((doc: any) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{doc.name}</p>
                        <p className="text-sm text-slate-500">Updated: {doc.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(doc.status)}
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">View</Button>
                        {doc.status !== 'verified' && (
                          <Button variant="primary" size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
