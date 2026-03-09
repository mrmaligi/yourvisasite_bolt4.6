import { FileText, Shield, HelpCircle, Mail, ChevronRight } from 'lucide-react';

export function UserLegalV2() {
  const sections = [
    { title: 'Terms of Service', description: 'Rules and guidelines for using VisaBuild', icon: FileText },
    { title: 'Privacy Policy', description: 'How we collect and use your data', icon: Shield },
    { title: 'Cookie Policy', description: 'Information about cookies on our site', icon: FileText },
    { title: 'Data Processing Agreement', description: 'How we process your personal data', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Legal Information</h1>
          <p className="text-slate-600">Important legal documents and policies</p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="bg-white border border-slate-200 p-6 flex items-center justify-between hover:border-blue-400 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{section.title}</p>
                  <p className="text-sm text-slate-500">{section.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          ))}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Have questions about our legal policies?</p>
              <p className="text-sm text-amber-700">Contact our legal team for clarification on any of our terms or policies.</p>
              <a href="mailto:legal@visabuild.com" className="text-amber-800 underline mt-2 inline-block">legal@visabuild.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
