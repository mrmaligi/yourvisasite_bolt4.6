import { BookOpen, FileText, Video, Download, ChevronRight } from 'lucide-react';

export function GuideListV2() {
  const guides = [
    { title: 'Partner Visa Complete Guide', type: 'PDF', pages: 45, downloads: 2341 },
    { title: 'Document Checklist', type: 'PDF', pages: 12, downloads: 1892 },
    { title: 'Relationship Evidence Guide', type: 'PDF', pages: 28, downloads: 1456 },
    { title: 'Financial Requirements', type: 'PDF', pages: 15, downloads: 1123 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Visa Guides</h1>
          <p className="text-slate-400">Comprehensive guides for your visa journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-blue-600">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-900">{guide.title}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="px-2 py-0.5 bg-slate-100">{guide.type}</span>
                      <span>{guide.pages} pages</span>
                      <span>{guide.downloads} downloads</span>
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
