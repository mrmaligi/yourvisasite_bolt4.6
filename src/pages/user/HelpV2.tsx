import { HelpCircle, FileText, MessageCircle, Phone, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserHelpV2() {
  const faqs = [
    { question: 'How do I upload documents?', answer: 'Go to Documents section and click Upload.' },
    { question: 'How long does processing take?', answer: 'Processing times vary by visa type, typically 2-6 months.' },
    { question: 'Can I change my lawyer?', answer: 'Yes, contact support to request a change.' },
    { question: 'How do I track my application?', answer: 'Visit My Applications to see real-time status updates.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Help Center</h1>
          <p className="text-slate-600">Find answers to common questions</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search help articles..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 mb-6">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4">
                <p className="font-medium text-slate-900 mb-1">{faq.question}</p>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with support' },
            { icon: Phone, title: 'Call Us', desc: '+61 2 1234 5678' },
            { icon: FileText, title: 'Documentation', desc: 'Browse all guides' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 p-4 text-center">
              <item.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
