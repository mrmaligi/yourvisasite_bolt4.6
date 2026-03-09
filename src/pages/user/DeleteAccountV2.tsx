import { Trash2, AlertTriangle, Clock, Archive } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserDeleteAccountV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Delete Account</h1>
          <p className="text-slate-600">Permanently delete your account and all associated data</p>
        </div>

        <div className="bg-red-50 border border-red-200 p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Warning: This action cannot be undone</p>
              <p className="text-sm text-red-700">Once you delete your account, all your data will be permanently removed. This includes applications, documents, and payment history.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-8">
          <h2 className="font-semibold text-slate-900 mb-4">What will be deleted</h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-red-500" /> Your profile and personal information</li>
            <li className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-red-500" /> All visa applications</li>
            <li className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-red-500" /> Uploaded documents</li>
            <li className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-red-500" /> Consultation history</li>
            <li className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-red-500" /> Payment and billing information</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-8">
          <h2 className="font-semibold text-slate-900 mb-4">Before you go</h2>
          <p className="text-slate-600 mb-4">Consider these alternatives:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50">
              <Archive className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Deactivate instead</p>
                <p className="text-sm text-slate-500">Temporarily disable your account without deleting data</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50">
              <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Export your data first</p>
                <p className="text-sm text-slate-500">Download a copy of your information before deletion</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Delete My Account</Button>
        </div>
      </div>
    </div>
  );
}
