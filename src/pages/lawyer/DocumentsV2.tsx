import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Folder, FileText, Upload, Plus, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

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

  const stats = {
    total: items.length,
    folders: items.filter(i => i.type === 'folder').length,
    files: items.filter(i => i.type === 'file').length,
  };

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
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Items', value: stats.total, icon: FileText },
              { label: 'Folders', value: stats.folders, icon: Folder, color: 'text-yellow-600' },
              { label: 'Files', value: stats.files, icon: FileText, color: 'text-blue-600' },
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

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 p-4 hover:border-blue-300 transition-colors group"
              >
                <div className="aspect-square bg-slate-100 flex items-center justify-center mb-3">
                  {item.type === 'folder' ? (
                    <Folder className="w-12 h-12 text-yellow-500" />
                  ) : (
                    <FileText className="w-12 h-12 text-blue-500" />
                  )}
                </div>
                
                <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                
                {item.size && <p className="text-xs text-slate-500">{item.size}</p>}
                
                <p className="text-xs text-slate-400">{item.updatedAt}</p>
                
                <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button variant="danger" size="sm">
                    <Trash2 className="w-3 h-3" />
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
