import { Shield, Lock, FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';

export function PublicSecurityV2() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Security</h1>
          <p className="text-slate-600 mt-2">How we protect your data</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Data Encryption</h2>
            </div>
            <p className="text-slate-700">All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your sensitive documents are stored securely with enterprise-grade encryption.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">Two-Factor Authentication</h2>
            </div>
            <p className="text-slate-700">We support two-factor authentication to add an extra layer of security to your account. Enable 2FA in your account settings.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-slate-900">Regular Security Audits</h2>
            </div>
            <p className="text-slate-700">We conduct regular security audits and penetration testing to identify and address potential vulnerabilities.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-slate-900">Compliance</h2>
            </div>
            <p className="text-slate-700">We comply with GDPR, Australian Privacy Act, and other relevant data protection regulations.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
