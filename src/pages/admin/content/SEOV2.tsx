import { Search, Globe, Link, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function SEOV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">SEO Settings</h1>
          <p className="text-slate-600">Optimize your site for search engines</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">General SEO</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Site Title</label>
                <input type="text" defaultValue="VisaBuild - Australian Immigration Made Easy" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                <textarea defaultValue="Expert guidance for Australian visas..." className="w-full px-3 py-2 border border-slate-200 h-24" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Link className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Social Media</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Open Graph Image</label>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Image URL" className="flex-1 px-3 py-2 border border-slate-200" />
                  <Button variant="outline" size="sm">Browse</Button>
                </div>
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
