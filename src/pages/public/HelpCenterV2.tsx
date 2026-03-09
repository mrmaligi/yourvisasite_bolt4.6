import { HelpCircle, Search, FileText, MessageCircle, ChevronRight } from 'lucide-react';

export function PublicHelpCenterV2() {
  const categories = [
    { id: 1, name: 'Getting Started', description: 'New user guides and basics', articles: 12 },
    { id: 2, name: 'Applications', description: 'How to apply for visas', articles: 24 },
    { id: 3, name: 'Documents', description: 'Document requirements and uploads', articles: 18 },
    { id: 4, name: 'Payments', description: 'Billing and refunds', articles: 8 },
    { id: 5, name: 'Account', description: 'Profile and settings', articles: 15 },
    { id: 6, name: 'Troubleshooting', description: 'Common issues and solutions', articles: 20 },
  ];

  const popularArticles = [
    'How do I start a visa application?',
    'What documents do I need?',
    'How long does processing take?',
    'How do I contact my lawyer?',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-slate-300 mb-8">Find answers to your questions</p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search for help..." className="w-full pl-12 pr-4 py-4 text-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white border border-slate-200 p-6 hover:border-blue-400 cursor-pointer transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{cat.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{cat.description}</p>
                    <p className="text-sm text-blue-600">{cat.articles} articles</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Popular Articles</h3>
            <div className="space-y-3">
              {popularArticles.map((article) => (
                <a key={article} href="#" className="flex items-center gap-2 text-slate-700 hover:text-blue-600">
                  <FileText className="w-4 h-4" />
                  {article}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Still need help?</h3>
            </div>
            <p className="text-blue-700 mb-4">Our support team is available 24/7 to assist you.</p>
            <button className="text-blue-600 font-medium hover:underline">Contact Support →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
