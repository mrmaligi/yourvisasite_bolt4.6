import { HelpCircle, BookOpen, MessageCircle, Video, FileText, ChevronRight } from 'lucide-react';

export function HelpCenterV2() {
  const categories = [
    { name: 'Getting Started', icon: BookOpen, articles: 12 },
    { name: 'Visa Applications', icon: FileText, articles: 24 },
    { name: 'Account & Billing', icon: HelpCircle, articles: 8 },
    { name: 'Video Tutorials', icon: Video, articles: 15 },
  ];

  const popular = [
    'How to apply for a Partner Visa',
    'What documents do I need?',
    'How long does the process take?',
    'How much does it cost?',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-slate-400">Find answers and get support</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 gap-4 mb-12">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <cat.icon className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900">{cat.name}</p>
                    <p className="text-sm text-slate-500">{cat.articles} articles</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mb-4">Popular Articles</h2>
        
        <div className="bg-white border border-slate-200">
          {popular.map((article, i) => (
            <div key={i} className="p-4 flex items-center justify-between border-b border-slate-200 last:border-0 cursor-pointer hover:bg-slate-50">
              <span className="text-slate-700">{article}</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
