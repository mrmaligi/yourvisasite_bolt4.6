import { HelpCircle, MessageSquare, Phone, Mail, ChevronRight } from 'lucide-react';

export function HelpTopicsV2() {
  const topics = [
    { title: 'Getting Started', articles: 12, icon: HelpCircle },
    { title: 'Account & Profile', articles: 8, icon: MessageSquare },
    { title: 'Payments & Billing', articles: 6, icon: Phone },
    { title: 'Document Upload', articles: 10, icon: HelpCircle },
    { title: 'Consultations', articles: 7, icon: MessageSquare },
    { title: 'Technical Issues', articles: 15, icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Help Topics</h1>
          <p className="text-slate-400">Browse by category to find what you need</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 gap-4">
          {topics.map((topic) => (
            <div key={topic.title} className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <topic.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-900">{topic.title}</p>
                    <p className="text-sm text-slate-500">{topic.articles} articles</p>
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
