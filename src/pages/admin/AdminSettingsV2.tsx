import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, Globe, DollarSign, Settings2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function AdminSettingsV2() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: 'VisaBuild',
    site_tagline: 'Your trusted visa application companion',
    default_currency: 'AUD',
    support_email: 'support@visabuild.com.au',
    features: {
      tracker_enabled: true,
      marketplace_enabled: true,
      consultations_enabled: true,
      news_enabled: true,
      premium_enabled: true,
    },
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved!');
    }, 1000);
  };

  const toggleFeature = (feature: keyof typeof settings.features) => {
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  return (
    <>
      <Helmet>
        <title>Settings | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
                <p className="text-slate-600">Manage global platform configuration</p>
              </div>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* General Settings - SQUARE */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">General Settings</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.site_tagline}
                      onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settings.support_email}
                      onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Currency Settings</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
                  <select
                    value={settings.default_currency}
                    onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Features - SQUARE */}
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Features</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(settings.features).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700 capitalize">{key.replace('_', ' ')}</span>
                    <button
                      onClick={() => toggleFeature(key as keyof typeof settings.features)}
                      className={`w-12 h-6 relative transition-colors ${
                        enabled ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white transition-all ${
                          enabled ? 'left-7' : 'left-1'
                        }`}
                      />
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
