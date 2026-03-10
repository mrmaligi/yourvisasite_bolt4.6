import { BookOpen, FileText, Video, Headphones, ChevronRight } from 'lucide-react';

export function LearningCenterV2() {
  const resources = [
    { title: 'Getting Started Guide', type: 'PDF', duration: '15 min read', icon: FileText },
    { title: 'Visa Application Tutorial', type: 'Video', duration: '45 min', icon: Video },
    { title: 'Document Checklist Workshop', type: 'Video', duration: '30 min', icon: Video },
    { title: 'Live Q&A Session', type: 'Live', duration: 'Mar 25, 2:00 PM', icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Learning Center</h1>
          <p className="text-slate-400">Resources to help you navigate the visa process</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Featured Resources</h2>
        
        <div className="space-y-4">
          {resources.map((resource, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 flex items-center justify-between cursor-pointer hover:border-blue-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <resource.icon className="w-6 h-6 text-blue-600" />
                </div>
                
                <div>
                  <p className="font-semibold text-slate-900">{resource.title}</p>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="px-2 py-0.5 bg-slate-100">{resource.type}</span>
                    <span>{resource.duration}</span>
                  </div>
                </div>
              </div>
              
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
