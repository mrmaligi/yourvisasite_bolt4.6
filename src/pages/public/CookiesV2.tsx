import { AlertTriangle, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicCookiesV2() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Cookie Policy</h1>
          <p className="text-slate-600 mt-2">Last updated: March 2024</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">What Are Cookies</h2>
            </div>
            <p className="text-slate-700">Cookies are small text files stored on your device when you visit websites. They help us provide and improve our services.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">How We Use Cookies</h2>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li>• Essential cookies for website functionality</li>
              <li>• Analytics cookies to understand usage</li>
              <li>• Preference cookies to remember your settings</li>
              <li>• Marketing cookies for relevant content</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-slate-900">Managing Cookies</h2>
            </div>
            <p className="text-slate-700">You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.</p>
          </section>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
            <p className="text-blue-900">Update your cookie preferences at any time</p>
          </div>
          <Button variant="outline">Cookie Settings</Button>
        </div>
      </div>
    </div>
  );
}
