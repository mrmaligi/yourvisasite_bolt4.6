import { Link2, Copy, Share2, Mail, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserSharedV2() {
  const shared = [
    { id: 1, name: 'Partner Visa Application', type: 'Application', sharedWith: 'Jane Smith', date: '2024-03-20', access: 'view' },
    { id: 2, name: 'Document Package', type: 'Documents', sharedWith: 'Support Team', date: '2024-03-18', access: 'edit' },
    { id: 3, name: 'Consultation Notes', type: 'Notes', sharedWith: 'Bob Wilson', date: '2024-03-15', access: 'view' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Shared Items</h1>
          <p className="text-slate-600">Manage items you've shared with others</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-8">
          <h2 className="font-semibold text-slate-900 mb-4">Quick Share</h2>
          <div className="flex gap-2">
            <input type="text" defaultValue="https://visabuild.com/share/abc123" className="flex-1 px-3 py-2 border border-slate-200 bg-slate-50" readOnly />
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-1" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Shared with Others</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {shared.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.type} • Shared with {item.sharedWith} • {item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700">{item.access} access</span>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
