import { BookOpen, FileText, Video, Headphones, ChevronRight, Star } from 'lucide-react';

export function ResourceLibraryV2() {
  const resources = [
    { title: 'Complete Partner Visa Guide', type: 'PDF', size: '4.2 MB', downloads: 2341 },
    { title: 'Document Checklist', type: 'PDF', size: '1.8 MB', downloads: 1892 },
    { title: 'Interview Tips Video', type: 'Video', duration: '15 min', downloads: 1456 },
    { title: 'Visa Timeline Calculator', type: 'Tool', usage: 892 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Resource Library</h1>
          <p className="text-slate-400">Guides, templates, and tools to help your visa journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((resource, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-blue-600">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-900">{resource.title}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="px-2 py-0.5 bg-slate-100">{resource.type}</span>
                      <span>{resource.size || resource.duration || `${resource.usage} uses`}</span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
