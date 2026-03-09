import { FileText, Shield, Lock, Eye, UserCheck } from 'lucide-react';

export function PublicPrivacyV2() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="text-slate-600 mt-2">Last updated: March 2024</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Information We Collect</h2>
            </div>
            <p className="text-slate-700">We collect information you provide directly to us, including personal information such as your name, email address, and documents submitted for visa applications.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">How We Use Your Information</h2>
            </div>
            <p className="text-slate-700">We use your information to provide visa consulting services, process applications, communicate with you, and improve our platform.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-slate-900">Information Sharing</h2>
            </div>
            <p className="text-slate-700">We do not sell your personal information. We may share information with immigration authorities as required for visa applications and with service providers who assist in our operations.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-slate-900">Your Rights</h2>
            </div>
            <p className="text-slate-700">You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
