import { Settings, Sliders, ToggleLeft, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApiSettingsV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">API Settings</h1>
          <p className="text-slate-600">Configure API behavior and security</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">General Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Enable CORS</p>
                  <p className="text-sm text-slate-500">Allow cross-origin requests</p>
                </div>
                <button className="w-10 h-6 bg-blue-600 flex items-center">
                  <div className="w-4 h-4 bg-white mx-1 translate-x-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Request Logging</p>
                  <p className="text-sm text-slate-500">Log all API requests</p>
                </div>
                <button className="w-10 h-6 bg-blue-600 flex items-center">
                  <div className="w-4 h-4 bg-white mx-1 translate-x-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">IP Whitelist</p>
                  <p className="text-sm text-slate-500">Restrict access by IP</p>
                </div>
                <button className="w-10 h-6 bg-slate-200 flex items-center">
                  <div className="w-4 h-4 bg-white mx-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
