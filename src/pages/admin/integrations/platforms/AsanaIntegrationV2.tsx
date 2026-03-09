import { CheckSquare, CheckCircle, Plus, MoreVertical } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AsanaIntegrationV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Asana Integration</h1>
          <p className="text-slate-600">Connect Asana for project management</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-100 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Asana</p>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Default Workspace</label>
              <select className="w-full px-3 py-2 border border-slate-200">
                <option>VisaBuild Team</option>
                <option>Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Default Project</label>
              <select className="w-full px-3 py-2 border border-slate-200">
                <option>Content Calendar</option>
                <option>Development</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="primary">Save Settings</Button>
          <Button variant="outline">Disconnect</Button>
        </div>
      </div>
    </div>
  );
}
