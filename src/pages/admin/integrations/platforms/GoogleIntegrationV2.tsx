import { Mail, CheckCircle, XCircle, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function GoogleIntegrationV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Google Integration</h1>
          <p className="text-slate-600">Connect Google services</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Google Workspace</p>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50">
              <span className="text-slate-700">Gmail</span>
              <span className="text-green-600 text-sm">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50">
              <span className="text-slate-700">Google Calendar</span>
              <span className="text-green-600 text-sm">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50">
              <span className="text-slate-700">Google Drive</span>
              <span className="text-slate-400 text-sm">Disabled</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="primary">Save Settings</Button>
          <Button variant="outline">Disconnect</Button>
        </div>
      </div>
    </div>
  );
}
