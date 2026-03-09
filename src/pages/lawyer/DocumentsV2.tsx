import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Folder, FileText, Upload, Plus, Download, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface DocItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  updatedAt: string;
}

const MOCK_DOCS: DocItem[] = [
  { id: '1', name: 'Client Visas', type: 'folder', updatedAt: '2024-03-20' },
  { id: '2', name: 'Templates', type: 'folder', updatedAt: '2024-02-15' },
  { id: '3', name: 'Invoices', type: 'folder', updatedAt: '2024-03-10' },
  { id: '4', name: 'Guide - Partner Visa.pdf', type: 'file', size: '2.4 MB', updatedAt: '2024-03-18' },
  { id: '5', name: 'Checklist - 189 Visa.docx', type: 'file', size: '1.1 MB', updatedAt: '2024-03-12' },
];

export function DocumentsV2() {
  const [items] = useState<DocItem[]>(MOCK_DOCS);
  const [search, setSearch] = useState('');

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const folders = filteredItems.filter(i => i.type === 'folder');
  const files = filteredItems.filter(i => i.type === 'file');

  return (
    <>
      <Helmet>
        <title>Documents | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                <p className="text-slate-600">Manage and organize your firm's documents</p>
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
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200"
              />
            </div>
          </div>

          {folders.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-slate-600 mb-3">Folders</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <div key={folder.id} className="bg-white border border-slate-200 p-4 hover:border-blue-400 cursor-pointer">
                    <div className="flex flex-col items-center text-center">
                      <Folder className="w-12 h-12 text-yellow-500 mb-2" />
                      <p className="font-medium text-slate-900 truncate w-full">{folder.name}</p>
                      <p className="text-xs text-slate-500">{folder.updatedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-slate-600 mb-3">Files</h2>
              <div className="bg-white border border-slate-200">
                <div className="divide-y divide-slate-200">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-900">{file.name}</p>
                          <p className="text-sm text-slate-500">{file.size} • {file.updatedAt}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
