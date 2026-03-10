import { FileText, Download, Eye, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function DocumentLibraryV2() {
  const documents = [
    { id: 1, name: 'Partner Visa Application Form', type: 'PDF', size: '2.4 MB', downloads: 1234 },
    { id: 2, name: 'Document Checklist', type: 'PDF', size: '1.8 MB', downloads: 987 },
    { id: 3, name: 'Relationship Statement Template', type: 'DOCX', size: '156 KB', downloads: 756 },
    { id: 4, name: 'Financial Evidence Guide', type: 'PDF', size: '3.2 MB', downloads: 654 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Document Library</h1>
          <p className="text-slate-400">Download forms, templates, and guides</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Document</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Type</th>
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
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700">{doc.type}</span>
                  </td>
                  <td className="p-4 text-slate-600">{doc.size}</td>
                  <td className="p-4 text-slate-600">{doc.downloads.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
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
