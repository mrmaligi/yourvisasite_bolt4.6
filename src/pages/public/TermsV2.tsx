import { Helmet } from 'react-helmet-async';
import { Shield, FileText, Scale } from 'lucide-react';

export function TermsV2() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | VisaBuild</title>
        <meta name="description" content="VisaBuild terms of service and user agreement." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-slate-300">Last updated: March 8, 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border border-slate-200 p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                By accessing and using VisaBuild, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
              <p className="text-slate-700 leading-relaxed">
                VisaBuild provides information about Australian visas, processing times, 
                and connections to immigration professionals. We do not provide legal advice 
                and are not a law firm.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the confidentiality of your account</li>
                <li>Not use the service for any illegal purposes</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Disclaimer</h2>
              <p className="text-slate-700 leading-relaxed">
                The information provided on VisaBuild is for general informational purposes only. 
                It is not legal advice and should not be relied upon as such. Always consult with 
                a qualified immigration lawyer for advice specific to your situation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed">
                VisaBuild shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users 
                of any material changes via email or through the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Contact</h2>
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about these Terms, please contact us at 
                legal@visabuild.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
