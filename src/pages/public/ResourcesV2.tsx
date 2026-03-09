import { FileText, Download, Eye, Star, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicResourcesV2() {
  const resources = [
    { id: 1, title: 'Visa Application Guide', type: 'PDF', size: '2.4 MB', downloads: 4500 },
    { id: 2, title: 'Document Checklist', type: 'XLSX', size: '45 KB', downloads: 3200 },
    { id: 3, title: 'Interview Tips Video', type: 'MP4', size: '156 MB', views: 2100 },
    { id: 4, title: 'Template Bundle', type: 'ZIP', size: '12 MB', downloads: 2800 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Resources</h1>
          <p className="text-xl text-slate-300">Free downloads to help with your visa journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <div key={res.id} className="bg-white border border-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900">{res.title}</h3>
                  <p className="text-sm text-slate-500">{res.type} • {res.size}</p>
                </div>
              </div>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                {res.views ? `${res.views} views` : `${res.downloads} downloads`}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
