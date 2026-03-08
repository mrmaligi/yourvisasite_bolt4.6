import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, Trash2 } from 'lucide-react';

export function PrivacyV2() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | VisaBuild</title>
        <meta name="description" content="VisaBuild privacy policy and data protection practices." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-slate-300">Last updated: March 8, 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border border-slate-200 p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Information We Collect
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Account information (name, email, phone)</li>
                <li>Profile information</li>
                <li>Visa application tracking data</li>
                <li>Communications with lawyers through our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                How We Use Your Information
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process your visa tracking submissions</li>
                <li>Connect you with immigration lawyers</li>
                <li>Send you updates about your applications</li>
                <li>Improve our platform and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Data Security
              </h2>
              <p className="text-slate-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect 
                your personal information. However, no method of transmission over the Internet 
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-blue-600" />
                Your Rights
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Third-Party Services</h2>
              <p className="text-slate-700 leading-relaxed">
                We use third-party services (such as payment processors and analytics tools) 
                that may collect information as governed by their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Changes to This Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of 
                any changes by posting the new policy on this page and updating the date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@visabuild.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
