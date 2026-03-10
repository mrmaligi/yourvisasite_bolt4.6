import { Lock, Shield, Eye, FileText, Server, Globe } from 'lucide-react';

export function PrivacyPolicyV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">How we collect, use, and protect your data</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-200 p-8">
          <div className="prose max-w-none">
            <p className="text-sm text-slate-500 mb-8">Last updated: March 2024</p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
            <p className="text-slate-600 mb-6">
              We collect information you provide directly to us, including name, email address, 
              phone number, and documents you upload for your visa applications. We also collect 
              usage data to improve our services.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-600 mb-6">
              Your information is used to provide visa consulting services, process applications, 
              communicate with you, and improve our platform. We never sell your personal data to third parties.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Data Security</h2>
            <p className="text-slate-600 mb-6">
              We implement industry-standard security measures including encryption, secure servers, 
              and regular security audits to protect your data.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Your Rights</h2>
            <p className="text-slate-600 mb-6">
              You have the right to access, correct, or delete your personal information. 
              Contact us to exercise these rights.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Contact Us</h2>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy, please contact us at 
              privacy@visabuild.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
