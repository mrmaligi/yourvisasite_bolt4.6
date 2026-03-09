import { Briefcase, CheckCircle, Clock, User, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CaseDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Cases</span>
            <span>/</span>
            <span className="text-white">C-001</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Partner Visa Application</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Case Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Client</p>
                  <p className="font-medium text-slate-900">John Doe</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Visa Type</p>
                  <p className="font-medium text-slate-900">Partner Visa (820)</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">In Progress</span>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Started</p>
                  <p className="font-medium text-slate-900">March 15, 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Required Documents</h2>
              
              <div className="space-y-3">
                {[
                  { name: 'Passport', status: 'received' },
                  { name: 'Birth Certificate', status: 'pending' },
                  { name: 'Relationship Evidence', status: 'pending' },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3 bg-slate-50">
                    <span className="text-slate-700">{doc.name}</span>
                    <span className={`text-xs px-2 py-1 ${
                      doc.status === 'received' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Progress</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700">Initial Consultation</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700">Document Collection</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-900 font-medium">Application Preparation</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-slate-300" />
                  <span className="text-slate-400">Submission</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full">Upload Document</Button>
                <Button variant="outline" className="w-full">Schedule Meeting</Button>
                <Button variant="outline" className="w-full">Send Message</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
