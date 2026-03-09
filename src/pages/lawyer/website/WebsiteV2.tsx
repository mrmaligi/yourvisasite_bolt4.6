import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout, Palette, Image as ImageIcon, ExternalLink, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export function WebsiteV2() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Jane Doe Law',
    primaryColor: '#2563EB',
    welcomeMessage: 'Welcome to my law practice. I specialize in immigration law.',
    isPublished: true,
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <>
      <Helmet>
        <title>Website Builder | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Website Builder</h1>
                <p className="text-slate-600">Customize your personal lawyer page</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={settings.isPublished ? 'success' : 'secondary'}>
                  {settings.isPublished ? 'Published' : 'Draft'}
                </Badge>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Publish'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Layout className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">General Settings</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Welcome Message</label>
                    <textarea
                      value={settings.welcomeMessage}
                      onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-12 h-10 border border-slate-200"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Profile Image</h2>
              </div>

              <div className="aspect-square bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                <ImageIcon className="w-12 h-12 text-slate-400" />
              </div>

              <Button variant="outline" className="w-full">Upload Image</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
