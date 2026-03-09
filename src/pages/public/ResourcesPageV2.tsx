import { BookOpen, FileText, Video, Download, ChevronRight } from 'lucide-react';

export function ResourcesV2() {
  const categories = [
    { name: 'Guides', count: 24, icon: BookOpen },
    { name: 'Templates', count: 12, icon: FileText },
    { name: 'Videos', count: 18, icon: Video },
    { name: 'Downloads', count: 35, icon: Download },
  ];

  const featured = [
    { title: 'Complete Partner Visa Guide', type: 'PDF', size: '4.2 MB' },
    { title: 'Document Checklist', type: 'PDF', size: '1.8 MB' },
    { title: 'Interview Tips Video', type: 'Video', duration: '15 min' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Resources</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Access guides, templates, and tools to help with your visa journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-4 gap-4 mb-12">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white border border-slate-200 p-6 text-center cursor-pointer hover:border-blue-600">
              <cat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <p className="font-medium text-slate-900">{cat.name}</p>
              <p className="text-sm text-slate-500">{cat.count} items</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mb-6">Featured Resources</h2>
        
        <div className="space-y-4">
          {featured.map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.type} • {item.size || item.duration}</p>
                </div>
              </div>
              
              <button className="p-2 text-slate-400 hover:text-blue-600"><ChevronRight className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
