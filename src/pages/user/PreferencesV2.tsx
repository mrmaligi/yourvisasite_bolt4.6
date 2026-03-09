import { Globe, Bell, Moon, Sun, Type } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserPreferencesV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Preferences</h1>
          <p className="text-slate-600">Customize your experience</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Language & Region</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                <select className="w-full px-3 py-2 border border-slate-200">
                  <option>English</option>
                  <option>中文 (Chinese)</option>
                  <option>हिंदी (Hindi)</option>
                  <option>Tiếng Việt (Vietnamese)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                <select className="w-full px-3 py-2 border border-slate-200">
                  <option>Australia/Sydney (AEDT)</option>
                  <option>Australia/Melbourne (AEDT)</option>
                  <option>Australia/Perth (AWST)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Type className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Compact Mode</span>
                <button className="w-10 h-6 bg-slate-200 flex items-center">
                  <div className="w-4 h-4 bg-white mx-1" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700">High Contrast</span>
                <button className="w-10 h-6 bg-slate-200 flex items-center">
                  <div className="w-4 h-4 bg-white mx-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary">Save Preferences</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
