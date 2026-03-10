import { FileText, Scale, Shield, Globe, AlertTriangle } from 'lucide-react';

export function LegalV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Legal</h1>
          <p className="text-slate-400">Important legal information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-4">
          {[
            { title: 'Terms of Service', icon: FileText, desc: 'Rules for using our platform' },
            { title: 'Privacy Policy', icon: Shield, desc: 'How we handle your data' },
            { title: 'Cookie Policy', icon: Globe, desc: 'How we use cookies' },
            { title: 'Disclaimer', icon: AlertTriangle, desc: 'Important legal disclaimers' },
            { title: 'Refund Policy', icon: Scale, desc: 'Our refund and cancellation terms' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 p-6 flex items-center gap-4 cursor-pointer hover:border-blue-600">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-slate-600" />
              </div>
              
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
