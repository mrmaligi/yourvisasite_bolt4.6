import { Download, FileText, FileSpreadsheet, Calendar, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserDataExportV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Data Export</h1>
          <p className="text-slate-600">Download your data for backup or portability</p>
        </div>

        <div className="space-y-4">
          {[
            { title: 'Personal Information', description: 'Your profile and account details', format: 'JSON', size: '12 KB', icon: FileText },
            { title: 'Application History', description: 'All your visa applications', format: 'CSV', size: '45 KB', icon: FileSpreadsheet },
            { title: 'Documents', description: 'Uploaded documents and files', format: 'ZIP', size: '24 MB', icon: FileText },
            { title: 'Consultation History', description: 'Past consultations and notes', format: 'PDF', size: '156 KB', icon: FileText },
            { title: 'Payment History', description: 'Invoices and transactions', format: 'CSV', size: '8 KB', icon: FileSpreadsheet },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.format} • {item.size}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 p-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Data Retention</p>
              <p className="text-sm text-amber-700">Your data is stored securely and retained according to our privacy policy. You can request deletion at any time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
