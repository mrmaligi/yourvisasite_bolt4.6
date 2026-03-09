import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function PublicTermsV2() {
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
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">Acceptance of Terms</h2>
            </div>
            <p className="text-slate-700">By accessing or using VisaBuild, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Our Services</h2>
            </div>
            <p className="text-slate-700">VisaBuild provides visa consulting services, document preparation assistance, and connections to registered migration agents. We do not guarantee visa approval.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-slate-900">User Responsibilities</h2>
            </div>
            <p className="text-slate-700">You are responsible for providing accurate information, maintaining the security of your account, and complying with all applicable laws.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-slate-900">Limitation of Liability</h2>
            </div>
            <p className="text-slate-700">VisaBuild is not liable for any visa application outcomes. We provide guidance and assistance, but final decisions rest with immigration authorities.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
