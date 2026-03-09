import { UserPlus, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function NewCaseV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">New Case</h1>
          <p className="text-slate-400">Create a new client case</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client Name *</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input type="email" className="flex-1 px-3 py-2 border border-slate-200" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <input type="tel" className="flex-1 px-3 py-2 border border-slate-200" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Visa Type *</label>
              <select className="w-full px-3 py-2 border border-slate-200">
                <option>Select visa type</option>
                <option>Partner Visa (820/801)</option>
                <option>Skilled Independent (189)</option>
                <option>Student Visa (500)</option>
                <option>Visitor Visa (600)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Case Notes</label>
              <textarea className="w-full px-3 py-2 border border-slate-200 h-32" />
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button variant="primary">Create Case</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
