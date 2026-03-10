import { FileText, Scale, Shield, AlertCircle } from 'lucide-react';

export function TermsOfServiceV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400">Please read these terms carefully before using our services</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-200 p-8">
          <p className="text-sm text-slate-500 mb-8">Last updated: March 2024</p>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-6">
              By accessing or using VisaBuild services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Services Provided</h2>
            <p className="text-slate-600 mb-6">
              VisaBuild provides visa consulting services, document preparation assistance, and 
              lawyer matching services. We do not guarantee visa approval and are not responsible 
              for decisions made by immigration authorities.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. User Responsibilities</h2>
            <p className="text-slate-600 mb-6">
              You are responsible for providing accurate and complete information. You must not 
              use our services for fraudulent purposes or submit false documents.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Payment and Refunds</h2>
            <p className="text-slate-600 mb-6">
              Fees for services are clearly stated before purchase. Refunds are available within 
              14 days if no services have been rendered.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-slate-600">
              VisaBuild shall not be liable for any indirect, incidental, or consequential damages 
              arising from the use of our services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
