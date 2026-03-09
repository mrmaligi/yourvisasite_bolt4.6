import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';

export function TermsPageV2() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
                <p className="text-slate-500">Last updated: February 19, 2026</p>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-600">
                  By accessing or using VisaBuild, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
                <p className="text-slate-600">
                  VisaBuild provides information about Australian visas, processing times, and 
                  connects users with registered immigration lawyers. We do not provide legal 
                  advice. All information is for educational purposes only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Not Legal Advice</h2>
                <p className="text-slate-600">
                  <strong>Important:</strong> Nothing on this website constitutes legal advice. 
                  VisaBuild is not a law firm. Our guides, articles, and tools are for informational 
                  purposes only. Always consult with a registered migration agent or lawyer for 
                  advice specific to your situation.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">4. User Accounts</h2>
                <p className="text-slate-600">
                  You are responsible for maintaining the confidentiality of your account 
                  information and for all activities that occur under your account. You agree 
                  to notify us immediately of any unauthorized use of your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Privacy</h2>
                <p className="text-slate-600">
                  Your use of VisaBuild is also governed by our Privacy Policy. Please review 
                  our Privacy Policy to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Contact</h2>
                <p className="text-slate-600">
                  If you have any questions about these Terms, please contact us at 
                  support@visabuild.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
