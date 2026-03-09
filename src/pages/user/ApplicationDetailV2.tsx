import { FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApplicationDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-900">APP-001</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Visa Application</h1>
          <p className="text-slate-600">Subclass 820/801 • Submitted on March 15, 2024</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Status', value: 'In Progress', color: 'text-blue-600' },
            { label: 'Lawyer', value: 'Jane Smith' },
            { label: 'Last Updated', value: '2 days ago' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className={`text-lg font-semibold ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Required Documents</h2>
          
          <div className="space-y-3">
            {[
              { name: 'Passport', status: 'uploaded' },
              { name: 'Birth Certificate', status: 'uploaded' },
              { name: 'Relationship Evidence', status: 'pending' },
              { name: 'Health Examination', status: 'pending' },
              { name: 'Police Clearance', status: 'not_required' },
            ].map((doc) => (
              <div key={doc.name} className="flex items-center justify-between p-3 bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{doc.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 ${
                  doc.status === 'uploaded' ? 'bg-green-100 text-green-700' :
                  doc.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {doc.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="primary">Upload Documents</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
