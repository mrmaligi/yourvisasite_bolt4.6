import { Upload, FileText, Trash2, Download, Folder } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerDocumentsV2() {
  const documents = [
    { id: 1, name: 'Client_Contract_Template.pdf', type: 'PDF', size: '245 KB', date: 'Mar 20, 2024' },
    { id: 2, name: 'Retainer_Agreement.docx', type: 'DOCX', size: '128 KB', date: 'Mar 18, 2024' },
    { id: 3, name: 'Checklist_Guide.pdf', type: 'PDF', size: '892 KB', date: 'Mar 15, 2024' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Documents</h1>
            <p className="text-slate-400">Manage your document templates</p>
          </div>
          <Button variant="primary">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
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
                <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-medium text-slate-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700">{doc.type}</span>
                  </td>
                  <td className="p-4 text-slate-600">{doc.size}</td>
                  <td className="p-4 text-slate-600">{doc.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
