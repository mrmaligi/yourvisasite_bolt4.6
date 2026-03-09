import { Image, Upload, Folder, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function MediaLibraryV2() {
  const files = [
    { id: 1, name: 'passport-photo.jpg', type: 'image', size: '2.4 MB', date: '2024-03-20' },
    { id: 2, name: 'visa-guide.pdf', type: 'pdf', size: '4.2 MB', date: '2024-03-18' },
    { id: 3, name: 'banner-hero.png', type: 'image', size: '1.8 MB', date: '2024-03-15' },
    { id: 4, name: 'document-checklist.docx', type: 'doc', size: '856 KB', date: '2024-03-12' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
            <p className="text-slate-600">Manage your media files</p>
          </div>
          <Button variant="primary">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {files.map((file) => (
            <div key={file.id} className="bg-white border border-slate-200 p-4">
              <div className="w-full h-32 bg-slate-100 mb-3 flex items-center justify-center">
                {file.type === 'image' ? (
                  <Image className="w-8 h-8 text-slate-400" />
                ) : (
                  <Folder className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <p className="font-medium text-slate-900 truncate">{file.name}</p>
              <p className="text-sm text-slate-500">{file.size} • {file.date}</p>
              <button className="mt-2 text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
