import { MessageCircle, CheckCircle, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function IntercomIntegrationV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Intercom Integration</h1>
          <p className="text-slate-600">Connect Intercom for customer messaging</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Intercom</p>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">App ID</label>
              <input type="text" defaultValue="************1234" className="w-full px-3 py-2 border border-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Workspace ID</label>
              <input type="text" defaultValue="visabuild" className="w-full px-3 py-2 border border-slate-200" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-slate-700">Enable chat widget</span>
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
