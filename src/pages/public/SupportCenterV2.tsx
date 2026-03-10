import { HelpCircle, Search, MessageCircle, Phone, Mail, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function SupportCenterV2() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { name: 'Getting Started', articles: 12, icon: HelpCircle },
    { name: 'Account Help', articles: 8, icon: HelpCircle },
    { name: 'Billing', articles: 6, icon: HelpCircle },
    { name: 'Technical Issues', articles: 15, icon: HelpCircle },
  ];

  const popularArticles = [
    'How do I reset my password?',
    'How to update payment method',
    'What documents do I need?',
    'How long does processing take?',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">How can we help?</h1>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 gap-4 mb-12">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-blue-600">
              <cat.icon className="w-8 h-8 text-blue-600 mb-3" />
              <p className="font-semibold text-slate-900">{cat.name}</p>
              <p className="text-sm text-slate-500">{cat.articles} articles</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mb-6">Popular Articles</h2>
        
        <div className="bg-white border border-slate-200">
          {popularArticles.map((article, i) => (
            <div key={i} className="p-4 flex items-center justify-between border-b border-slate-200 last:border-0 cursor-pointer hover:bg-slate-50">
              <span className="text-slate-700">{article}</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Can't find what you're looking for?</p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Live Chat
            </button>
            <button className="px-6 py-3 border border-slate-200 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
