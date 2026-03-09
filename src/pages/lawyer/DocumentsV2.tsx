import { FileText, Folder, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerDocumentsV2() {
  const folders = [
    { name: 'Client Documents', count: 45 },
    { name: 'Templates', count: 12 },
    { name: 'Forms', count: 8 },
  ];

  const recent = [
    { name: 'Passport_John_Doe.pdf', size: '2.4 MB', date: '2024-03-20' },
    { name: 'Application_Form_820.pdf', size: '1.8 MB', date: '2024-03-19' },
    { name: 'Bank_Statement.pdf', size: '3.2 MB', date: '2024-03-18' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Documents</h1>
            <p className="text-slate-400">Manage files and templates</p>
          </div>
          <Button variant="primary">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {folders.map((folder) => (
            <div key={folder.name} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center">
                  <Folder className="w-6 h-6 text-amber-600" />
                </div>
                
                <div>
                  <p className="font-semibold text-slate-900">{folder.name}</p>
                  <p className="text-sm text-slate-500">{folder.count} files</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Recent Files</h2>
          </div>
          
          <div className="divide-y divide-slate-200">
            {recent.map((file) => (
              <div key={file.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">{file.size} • {file.date}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
