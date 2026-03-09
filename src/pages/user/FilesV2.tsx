import { FileText, Image as ImageIcon, File, Music, Video, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserFilesV2() {
  const files = [
    { id: 1, name: 'passport_scan.pdf', type: 'PDF', size: '2.4 MB', date: '2024-03-20', icon: FileText },
    { id: 2, name: 'profile_photo.jpg', type: 'Image', size: '1.2 MB', date: '2024-03-18', icon: ImageIcon },
    { id: 3, name: 'bank_statement.pdf', type: 'PDF', size: '3.1 MB', date: '2024-03-15', icon: FileText },
    { id: 4, name: 'interview_notes.docx', type: 'Document', size: '45 KB', date: '2024-03-10', icon: File },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'Image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'Document': return <File className="w-5 h-5 text-blue-600" />;
      default: return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Files</h1>
            <p className="text-slate-600">Manage your uploaded files</p>
          </div>
          <Button variant="primary">Upload Files</Button>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">File</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Size</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getIcon(file.type)}
                        <span className="font-medium text-slate-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{file.type}</td>
                    <td className="px-6 py-4 text-slate-600">{file.size}</td>
                    <td className="px-6 py-4 text-slate-600">{file.date}</td>
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
    </div>
  );
}
