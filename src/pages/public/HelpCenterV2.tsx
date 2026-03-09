import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, BookOpen, MessageCircle, FileText, HelpCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  { id: '1', question: 'How do I start my visa application?', answer: 'Begin by taking our eligibility quiz to find the right visa for you.', category: 'Getting Started' },
  { id: '2', question: 'What documents do I need?', answer: 'Required documents vary by visa type. Common documents include passport, birth certificate, and proof of funds.', category: 'Documents' },
  { id: '3', question: 'How long does processing take?', answer: 'Processing times vary by visa type. Check our visa pages for current estimates.', category: 'Processing' },
  { id: '4', question: 'Can I work while my visa is processing?', answer: 'This depends on your current visa status. Consult with a lawyer for specific advice.', category: 'Work Rights' },
];

const CATEGORIES = [
  { id: 'getting-started', title: 'Getting Started', icon: BookOpen, articles: 12 },
  { id: 'visa-guides', title: 'Visa Guides', icon: FileText, articles: 48 },
  { id: 'account', title: 'Account & Billing', icon: HelpCircle, articles: 8 },
  { id: 'consultations', title: 'Consultations', icon: MessageCircle, articles: 6 },
];

export function HelpCenterV2() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Help Center | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">How can we help?</h1>
              
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!search && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="bg-white border border-slate-200 p-6 hover:border-blue-400 cursor-pointer transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <cat.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{cat.title}</h3>
                      <p className="text-sm text-slate-500">{cat.articles} articles</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{search ? 'Search Results' : 'Frequently Asked Questions'}</h2>
            </div>
            
            <div className="divide-y divide-slate-200">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="p-4">
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{faq.question}</p>
                      {!search && <Badge variant="secondary" className="mt-1">{faq.category}</Badge>}
                    </div>
                    
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  
                  {expandedId === faq.id && (
                    <p className="mt-3 text-slate-600">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 p-6 text-center">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">Still need help?</h3>
            <p className="text-blue-700 mb-4">Contact our support team</p>
            <Button variant="primary">Contact Support</Button>
          </div>
        </div>
      </div>
    </>
  );
}
