import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Key, Users, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export function SecurityV2() {
  const [settings, setSettings] = useState({
    twoFactorRequired: false,
    passwordMinLength: 8,
    sessionTimeout: 30,
    loginAttempts: 5,
  });

  return (
    <>
      <Helmet>
        <title>Security | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Security</h1>
                <p className="text-slate-600">Configure security settings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Active Sessions', value: '24', icon: Users },
              { label: 'Failed Logins', value: '3', icon: AlertTriangle, color: 'text-yellow-600' },
              { label: '2FA Enabled', value: '68%', icon: Key, color: 'text-green-600' },
              { label: 'Security Score', value: '92', icon: Shield, color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Authentication</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="twoFactorRequired"
                    checked={settings.twoFactorRequired}
                    onChange={(e) => setSettings({ ...settings, twoFactorRequired: e.target.checked })}
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <label htmlFor="twoFactorRequired" className="font-medium text-slate-900">Require 2FA for Admins</label>
                    <p className="text-sm text-slate-500">Mandatory two-factor authentication for admin users</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Password Length</label>
                    <input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Login Attempts</label>
                    <input
                      type="number"
                      value={settings.loginAttempts}
                      onChange={(e) => setSettings({ ...settings, loginAttempts: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Security Status: Good</p>
                <p className="text-sm text-green-600">No security issues detected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
