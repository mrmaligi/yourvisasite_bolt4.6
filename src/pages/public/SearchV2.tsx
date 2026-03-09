import { Search, FileText, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicSearchV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Search Results</h1>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" defaultValue="partner visa" className="w-full pl-12 pr-4 py-3 text-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <p className="text-slate-600 mb-6">Found 12 results for "partner visa"</p>

        <div className="space-y-4">
          {[
            { title: 'Partner Visa (820/801) - Complete Guide', type: 'Guide', excerpt: 'Everything you need to know about applying for a partner visa...' },
            { title: 'Partner Visa Processing Times', type: 'Article', excerpt: 'Current processing times and what to expect...' },
            { title: 'Document Checklist for Partner Visa', type: 'Resource', excerpt: 'Complete list of required documents...' },
            { title: 'Partner Visa Success Stories', type: 'Blog', excerpt: 'Real stories from successful applicants...' },
          ].map((result, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <span className="text-xs font-medium text-blue-600 uppercase">{result.type}</span>
                  <h3 className="font-semibold text-slate-900">{result.title}</h3>
                  <p className="text-slate-600">{result.excerpt}</p>
                </div>
                
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
