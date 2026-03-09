import { FileText, Scale, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export function PublicTermsPageV2() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
          <p className="text-slate-600 mt-2">Last updated: March 2024</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
            </div>
            <p className="text-slate-700">By accessing and using VisaBuild, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">2. Use License</h2>
            </div>
            <p className="text-slate-700">Permission is granted to temporarily use VisaBuild for personal, non-commercial transitory viewing only.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-slate-900">3. Disclaimer</h2>
            </div>
            <p className="text-slate-700">The materials on VisaBuild are provided on an 'as is' basis. We do not guarantee visa approval.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-slate-900">4. Governing Law</h2>
            </div>
            <p className="text-slate-700">These terms shall be governed by and construed in accordance with the laws of Australia.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
