import { Mail, CheckCircle, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function MailchimpIntegrationV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Mailchimp Integration</h1>
          <p className="text-slate-600">Connect your Mailchimp account for email marketing</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Mailchimp</p>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
              <input type="password" defaultValue="****************" className="w-full px-3 py-2 border border-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Audience List</label>
              <select className="w-full px-3 py-2 border border-slate-200">
                <option>Main Newsletter (2,450 subscribers)</option>
                <option>VIP Customers (120 subscribers)</option>
              </select>
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
