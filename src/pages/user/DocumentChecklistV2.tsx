import { FileText, CheckCircle, AlertCircle, Clock, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function DocumentChecklistV2() {
  const categories = [
    {
      name: 'Identity Documents',
      items: [
        { name: 'Passport', required: true, status: 'uploaded' },
        { name: 'Birth Certificate', required: true, status: 'pending' },
        { name: 'Driver License', required: false, status: 'uploaded' },
      ]
    },
    {
      name: 'Relationship Evidence',
      items: [
        { name: 'Marriage Certificate', required: true, status: 'uploaded' },
        { name: 'Joint Bank Statements', required: true, status: 'pending' },
        { name: 'Photos Together', required: true, status: 'pending' },
      ]
    },
    {
      name: 'Financial Documents',
      items: [
        { name: 'Tax Returns', required: true, status: 'pending' },
        { name: 'Employment Letter', required: true, status: 'pending' },
        { name: 'Payslips (6 months)', required: true, status: 'pending' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Document Checklist</h1>
          <p className="text-slate-400">Track your required documents</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-slate-900">Overall Progress</span>
            <span className="font-bold text-blue-600">25%</span>
          </div>
          <div className="h-3 bg-slate-100">
            <div className="h-full bg-blue-600 w-1/4" />
          </div>
          <p className="text-sm text-slate-500 mt-2">3 of 12 documents uploaded</p>
        </div>

        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white border border-slate-200">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">{cat.name}</h2>
              </div>
              
              <div className="divide-y divide-slate-200">
                {cat.items.map((item) => (
                  <div key={item.name} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.status === 'uploaded' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-300" />
                      )}
                      
                      <div>
                        <p className={`font-medium ${item.status === 'uploaded' ? 'text-slate-900' : 'text-slate-700'}`}>{item.name}</p>
                        {item.required && <span className="text-xs text-red-500">Required</span>}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" disabled={item.status === 'uploaded'}>
                      {item.status === 'uploaded' ? 'Uploaded' : 'Upload'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
