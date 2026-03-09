import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

export function PublicDisclaimerV2() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Disclaimer</h1>
          <p className="text-slate-600 mt-2">Important legal information</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-slate-900">Not Legal Advice</h2>
            </div>
            <p className="text-slate-700">The information provided on VisaBuild is for general informational purposes only and does not constitute legal advice. Immigration laws are complex and change frequently. Always consult with a qualified migration agent or lawyer for advice specific to your situation.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">No Guarantee of Outcomes</h2>
            </div>
            <p className="text-slate-700">VisaBuild does not guarantee the approval of any visa application. The final decision on all visa applications rests solely with the Department of Home Affairs and immigration authorities.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Third-Party Links</h2>
            </div>
            <p className="text-slate-700">Our website may contain links to third-party websites. We are not responsible for the content or accuracy of information on external sites.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
