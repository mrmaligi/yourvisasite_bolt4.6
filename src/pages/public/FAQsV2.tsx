import { FileText, CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

export function PublicFAQsV2() {
  const faqs = [
    { q: 'How long does visa processing take?', a: 'Processing times vary by visa type. Partner visas typically take 18-24 months, while student visas take 1-3 months.' },
    { q: 'Can I work while my visa is processing?', a: 'This depends on your current visa status and the type of visa you have applied for. Check your visa conditions.' },
    { q: 'What documents do I need?', a: 'Required documents vary by visa type. Common documents include passport, birth certificate, and proof of relationship.' },
    { q: 'How much does a visa cost?', a: 'Visa fees range from $650 for student visas to over $8,000 for partner visas. Additional costs may apply.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-300">Find answers to common questions</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 text-center">
          <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-blue-900 mb-2">Still have questions?</h3>
          <a href="/contact" className="text-blue-600 font-medium hover:underline">Contact us →</a>
        </div>
      </div>
    </div>
  );
}
