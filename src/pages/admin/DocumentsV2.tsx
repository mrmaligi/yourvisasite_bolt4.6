import { FileText, Plus, Search, Edit, Trash2, Eye, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminDocumentsV2() {
  const documents = [
    { id: 1, name: 'Partner_Visa_Guide_2024.pdf', type: 'PDF', size: '4.2 MB', category: 'Guides', downloads: 1234 },
    { id: 2, name: 'Document_Checklist.pdf', type: 'PDF', size: '1.8 MB', category: 'Templates', downloads: 892 },
    { id: 3, name: 'Application_Form.pdf', type: 'PDF', size: '2.1 MB', category: 'Forms', downloads: 567 },
    { id: 4, name: 'Interview_Tips.pdf', type: 'PDF', size: '856 KB', category: 'Guides', downloads: 445 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Documents</h1>
            <p className="text-slate-400">Manage uploaded documents</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search documents..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Document</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Category</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Size</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Downloads</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-slate-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700">{doc.category}</span>
                  </td>
                  <td className="p-4 text-slate-600">{doc.size}</td>
                  <td className="p-4">{doc.downloads.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
