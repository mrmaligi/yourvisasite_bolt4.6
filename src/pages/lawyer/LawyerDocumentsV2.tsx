import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Download, Eye, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface SharedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  clientName: string;
  sharedDate: string;
  visaType: string;
}

const MOCK_DOCS: SharedDocument[] = [
  { id: '1', name: 'Passport_Copy.pdf', type: 'pdf', size: '2.4 MB', clientName: 'Sarah Johnson', sharedDate: '2024-03-20', visaType: 'Partner Visa (820)' },
  { id: '2', name: 'Employment_Contract.docx', type: 'doc', size: '1.1 MB', clientName: 'Mike Chen', sharedDate: '2024-03-19', visaType: 'Skilled Independent (189)' },
  { id: '3', name: 'Bank_Statements.pdf', type: 'pdf', size: '5.2 MB', clientName: 'Emma Wilson', sharedDate: '2024-03-18', visaType: 'Student Visa (500)' },
];

export function LawyerDocumentsV2() {
  const [documents] = useState<SharedDocument[]>(MOCK_DOCS);

  const stats = {
    total: documents.length,
    clients: new Set(documents.map(d => d.clientName)).size,
  };

  return (
    <>
      <Helmet>
        <title>Client Documents | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Client Documents</h1>
                <p className="text-slate-600">Documents shared by your clients</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  <p className="text-sm text-slate-600">Documents</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.clients}</p>
                  <p className="text-sm text-slate-600">Clients</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Document</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Client</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Visa Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Shared</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
                            <span className="text-red-600 font-bold text-xs">{doc.type.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{doc.name}</p>
                            <p className="text-sm text-slate-500">{doc.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{doc.clientName}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary">{doc.visaType}</Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{doc.sharedDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
