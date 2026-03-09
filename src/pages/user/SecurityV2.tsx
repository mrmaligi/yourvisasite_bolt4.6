import { Shield, Lock, Smartphone, Mail, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserSecurityV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Security</h1>
          <p className="text-slate-600">Manage your account security settings</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Password</h2>
            </div>
            <p className="text-slate-600 mb-4">Last changed 3 months ago</p>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h2>
            </div>
            <p className="text-slate-600 mb-4">Add an extra layer of security to your account</p>
            <Button variant="primary">Enable 2FA</Button>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-amber-600" />
              <h2 className="text-lg font-semibold text-slate-900">Login Alerts</h2>
            </div>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-slate-700">Email me when someone logs in from a new device</span>
            </label>
          </div>

          <div className="bg-red-50 border border-red-200 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
                <p className="text-red-700 mb-4">Once you delete your account, there is no going back.</p>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Delete Account</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
