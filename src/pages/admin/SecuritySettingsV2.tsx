import { Shield, Lock, Eye, FileCheck, Server, Key } from 'lucide-react';

export function AdminSecurityV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Security Settings</h1>
          <p className="text-slate-400">Configure platform security</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Password Policy</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-slate-700">Require minimum 8 characters</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-slate-700">Require special characters</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-slate-700">Force password reset every 90 days</span>
                <input type="checkbox" className="w-4 h-4" />
              </label>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-slate-700">Require 2FA for admin users</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-slate-700">Require 2FA for lawyers</span>
                <input type="checkbox" className="w-4 h-4" />
              </label>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6 text-amber-600" />
              <h2 className="text-lg font-semibold text-slate-900">API Security</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-slate-700">Rate limiting enabled</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-slate-700">IP whitelisting</span>
                <input type="checkbox" className="w-4 h-4" />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white">Save Security Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
