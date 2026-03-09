import { Shield, Lock, Eye, FileCheck, Server } from 'lucide-react';

export function SecurityPageV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Security</h1>
          <p className="text-slate-400">How we protect your data</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Data Encryption</h2>
                <p className="text-slate-600">All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your sensitive information is always protected.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Privacy Controls</h2>
                <p className="text-slate-600">You have full control over your data. Choose what to share and with whom. We never sell your personal information to third parties.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 flex items-center justify-center">
                <Server className="w-6 h-6 text-amber-600" />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Secure Infrastructure</h2>
                <p className="text-slate-600">Our servers are hosted in SOC 2 Type II certified data centers with 24/7 monitoring and regular security audits.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
