import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, Globe, DollarSign, Settings2, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function AdminSettingsV2() {
  const [settings, setSettings] = useState({
    siteName: 'VisaBuild',
    siteTagline: 'Your trusted visa application companion',
    defaultCurrency: 'AUD',
    premiumPrice: 49,
    commissionRate: 15,
    supportEmail: 'support@visabuild.com.au',
    features: {
      tracker: true,
      marketplace: true,
      consultations: true,
      news: true,
      premium: true,
    },
  });

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <>
      <Helmet>
        <title>Settings | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
                <p className="text-slate-600">Configure global platform settings</p>
              </div>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">General</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.siteTagline}
                    onChange={(e) => setSettings({...settings, siteTagline: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
                  <select
                    value={settings.defaultCurrency}
                    onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  >
                    <option value="AUD">AUD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Premium Price ($)</label>
                  <input
                    type="number"
                    value={settings.premiumPrice}
                    onChange={(e) => setSettings({...settings, premiumPrice: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => setSettings({...settings, commissionRate: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings2 className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-900">Features</h2>
              </div>
              
              <div className="space-y-3">
                {Object.entries(settings.features).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
                    <span className="capitalize text-slate-700">{key.replace('_', ' ')}</span>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        features: {...settings.features, [key]: !enabled}
                      })}
                      className={`w-12 h-6 ${enabled ? 'bg-blue-600' : 'bg-slate-300'} relative transition-colors`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white transition-all ${enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
