import { HelpCircle, Search, MessageCircle, ChevronRight } from 'lucide-react';

export function FAQsV2() {
  const faqs = [
    {
      category: 'General',
      questions: [
        { q: 'How long does the visa process take?', a: 'Processing times vary depending on the visa type. Partner visas typically take 12-18 months.' },
        { q: 'What documents do I need?', a: 'Required documents include passport, birth certificate, and relationship evidence.' },
      ],
    },
    {
      category: 'Payment',
      questions: [
        { q: 'What payment methods are accepted?', a: 'We accept credit cards, PayPal, and bank transfers.' },
        { q: 'Can I get a refund?', a: 'Refunds are available within 14 days of purchase if no services have been used.' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-400">Find answers to common questions</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search questions..." className="w-full pl-12 pr-4 py-3 border border-slate-200" />
        </div>

        <div className="space-y-8">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{section.category}</h2>
              
              <div className="space-y-3">
                {section.questions.map((item, i) => (
                  <div key={i} className="bg-white border border-slate-200 p-4">
                    <div className="flex items-center justify-between cursor-pointer">
                      <p className="font-medium text-slate-900">{item.q}</p>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
