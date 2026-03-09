import { Shield, Lock, Smartphone, Key, History } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function SecuritySettingsV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Security Settings</h1>
          <p className="text-slate-400">Manage your account security</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="font-semibold text-slate-900">Password</h2>
                  <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                </div>
              </div>
              <Button variant="outline">Change</Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-green-600" />
                <div>
                  <h2 className="font-semibold text-slate-900">Two-Factor Authentication</h2>
                  <p className="text-sm text-slate-500">Add extra security to your account</p>
                </div>
              </div>
              <Button variant="primary">Enable</Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-amber-600" />
                <div>
                  <h2 className="font-semibold text-slate-900">API Keys</h2>
                  <p className="text-sm text-slate-500">Manage API access</p>
                </div>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <History className="w-6 h-6 text-slate-600" />
              <h2 className="font-semibold text-slate-900">Login History</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50">
                <div>
                  <p className="text-slate-900">Chrome on Windows</p>
                  <p className="text-sm text-slate-500">Sydney, Australia • Current session</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50">
                <div>
                  <p className="text-slate-900">Safari on iPhone</p>
                  <p className="text-sm text-slate-500">Sydney, Australia • 2 days ago</p>
                </div>
                <button className="text-sm text-red-600 hover:underline">Revoke</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
