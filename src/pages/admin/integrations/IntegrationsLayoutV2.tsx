import { Layout, Settings, Palette, Type } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function IntegrationsLayoutV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Integrations Layout</h1>
          <p className="text-slate-600">Configure integration display settings</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Layout className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Layout Options</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Default View</label>
                <select className="w-full px-3 py-2 border border-slate-200">
                  <option>Grid</option>
                  <option>List</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-700">Show connected integrations first</span>
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
