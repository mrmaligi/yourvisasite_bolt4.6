import { HelpCircle, FileText, MessageCircle, ChevronRight } from 'lucide-react';

export function PublicHelpCategoryV2() {
  const categories = [
    { name: 'Getting Started', articles: 12, icon: FileText },
    { name: 'Applications', articles: 24, icon: FileText },
    { name: 'Documents', articles: 18, icon: FileText },
    { name: 'Payments', articles: 8, icon: FileText },
    { name: 'Account', articles: 15, icon: FileText },
    { name: 'Troubleshooting', articles: 20, icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-4">
            <span>Help Center</span>
            <span>/</span>
            <span className="text-white">Categories</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Browse Categories</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white border border-slate-200 p-6 hover:border-blue-400 cursor-pointer transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                    <p className="text-sm text-slate-500">{cat.articles} articles</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 p-6 text-center">
          <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-blue-900 mb-2">Can't find what you're looking for?</h3>
          <p className="text-blue-700 mb-4">Our support team is here to help</p>
          <button className="text-blue-600 font-medium hover:underline">Contact Support →</button>
        </div>
      </div>
    </div>
  );
}
