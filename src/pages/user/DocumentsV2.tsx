import { FileText, Download, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserDocumentsV2() {
  const documents = [
    { id: 1, name: 'Passport.pdf', type: 'Identity', size: '2.4 MB', status: 'verified', uploaded: '2024-03-20' },
    { id: 2, name: 'Birth_Certificate.pdf', type: 'Identity', size: '1.2 MB', status: 'pending', uploaded: '2024-03-18' },
    { id: 3, name: 'Bank_Statement.pdf', type: 'Financial', size: '3.1 MB', status: 'verified', uploaded: '2024-03-15' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
            <p className="text-slate-600">Manage your uploaded documents</p>
          </div>
          <Button variant="primary">Upload Document</Button>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Document</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Uploaded</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{doc.name}</p>
                        <p className="text-sm text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{doc.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {doc.status === 'verified' && <CheckCircle className="w-3 h-3" />}
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{doc.uploaded}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
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
