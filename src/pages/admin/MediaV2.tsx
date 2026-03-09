import { FileText, Download, Trash2, Folder, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminMediaV2() {
  const files = [
    { name: 'banner-home.jpg', size: '2.4 MB', type: 'image', date: 'Mar 20, 2024' },
    { name: 'visa-guide.pdf', size: '4.2 MB', type: 'pdf', date: 'Mar 18, 2024' },
    { name: 'logo.png', size: '156 KB', type: 'image', date: 'Mar 15, 2024' },
    { name: 'webinar-recording.mp4', size: '156 MB', type: 'video', date: 'Mar 10, 2024' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Media Library</h1>
            <p className="text-slate-400">Manage uploaded files</p>
          </div>
          <Button variant="primary">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4">
          {files.map((file) => (
            <div key={file.name} className="bg-white border border-slate-200 p-4">
              <div className="h-32 bg-slate-100 mb-4 flex items-center justify-center">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
              
              <p className="font-medium text-slate-900 truncate">{file.name}</p>
              <p className="text-sm text-slate-500">{file.size} • {file.date}</p>
              
              <div className="flex gap-2 mt-3">
                <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
