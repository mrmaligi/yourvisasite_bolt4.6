import { FileText, Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export function DocumentUploadV2() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Upload Documents</h1>
          <p className="text-slate-400">Submit required documents for your application</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="border-2 border-dashed border-slate-300 p-12 text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            
            <p className="text-lg font-medium text-slate-900 mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-slate-500 mb-4">Support PDF, JPG, PNG up to 10MB each</p>
            
            <Button variant="outline">Select Files</Button>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Passport.pdf', status: 'uploaded', size: '2.4 MB' },
              { name: 'Birth_Certificate.pdf', status: 'pending', size: '1.8 MB' },
              { name: 'Bank_Statement.pdf', status: 'uploading', size: '3.2 MB' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{doc.name}</p>
                    <p className="text-sm text-slate-500">{doc.size}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 text-xs font-medium ${
                  doc.status === 'uploaded' ? 'bg-green-100 text-green-700' :
                  doc.status === 'uploading' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
