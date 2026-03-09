import { Headphones, MessageCircle, Mail, Clock, ChevronRight } from 'lucide-react';

export function UserSupportV2() {
  const faqs = [
    { question: 'How do I reset my password?', answer: 'Go to settings and click on "Change Password"' },
    { question: 'Can I change my lawyer?', answer: 'Yes, contact support to request a change' },
    { question: 'How long does processing take?', answer: 'Processing times vary by visa type' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Help & Support</h1>
          <p className="text-slate-400">We're here to help you</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white border border-slate-200 p-6 text-center cursor-pointer hover:border-blue-600">
            <MessageCircle className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Live Chat</h3>
            <p className="text-sm text-slate-500">Chat with our support team</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 text-center cursor-pointer hover:border-blue-600">
            <Mail className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold text-slate-900">Email Support</h3>
            <p className="text-sm text-slate-500">Get help via email</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>

        <div className="bg-white border border-slate-200">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 border-b border-slate-200 last:border-0">
              <div className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-slate-900">{faq.question}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
