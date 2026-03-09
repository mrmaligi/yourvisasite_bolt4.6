import { FileText, FileUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function DocumentDashboardV2() {
  const stats = [
    { label: 'Total Documents', value: '12', color: 'bg-blue-100 text-blue-600' },
    { label: 'Verified', value: '8', color: 'bg-green-100 text-green-600' },
    { label: 'Pending', value: '3', color: 'bg-amber-100 text-amber-600' },
    { label: 'Required', value: '5', color: 'bg-red-100 text-red-600' },
  ];

  const recent = [
    { name: 'Passport.pdf', status: 'verified', date: '2024-03-20' },
    { name: 'Birth_Certificate.pdf', status: 'pending', date: '2024-03-18' },
    { name: 'Bank_Statement.pdf', status: 'verified', date: '2024-03-15' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Document Dashboard</h1>
            <p className="text-slate-600">Manage and track your documents</p>
          </div>
          <Button variant="primary">
            <FileUp className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className={`p-4 ${stat.color.split(' ')[0]} border border-slate-200`}>
              <p className="text-sm opacity-80">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Recent Uploads</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {recent.map((doc) => (
              <div key={doc.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-900">{doc.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">{doc.date}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${
                    doc.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {doc.status === 'verified' && <CheckCircle className="w-3 h-3" />}
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
