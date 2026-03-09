import { User, Lock, Shield, Smartphone, Key } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AccountSecurityV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Account Security</h1>
          <p className="text-slate-400">Protect your account</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Password</h2>
            </div>
            
            <p className="text-slate-600 mb-4">Last changed 3 months ago</p>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h2>
            </div>
            
            <p className="text-slate-600 mb-4">Add an extra layer of security</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Status: Disabled</span>
              <Button variant="primary">Enable 2FA</Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6 text-amber-600" />
              <h2 className="text-lg font-semibold text-slate-900">Active Sessions</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Current Session</p>
                  <p className="text-sm text-slate-500">Sydney, Australia • Chrome on Windows</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
