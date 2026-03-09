import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, AlertCircle, FileText, CheckCircle, Upload } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Document {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
}

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: 'Practicing Certificate.pdf', status: 'pending' },
  { id: '2', name: 'ID Document.jpg', status: 'approved' },
  { id: '3', name: 'Insurance Certificate.pdf', status: 'pending' },
];

export function VerificationV2() {
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS);
  const [status] = useState<'approved' | 'pending' | 'rejected'>('pending');

  const getStatusBadge = (docStatus: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      approved: 'success',
      pending: 'warning',
      rejected: 'danger',
    };
    return <Badge variant={variants[docStatus]}>{docStatus}</Badge>;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'rejected': return <AlertCircle className="w-12 h-12 text-red-600" />;
      default: return <ShieldCheck className="w-12 h-12 text-yellow-600" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Verification | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Verification Status</h1>
                <p className="text-slate-600">Manage your professional credentials</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 p-8 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-100 flex items-center justify-center">
                {getStatusIcon()}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {status === 'approved' ? 'Verified' : status === 'rejected' ? 'Rejected' : 'Pending Review'}
                </h2>
                <p className="text-slate-600 mt-1">
                  {status === 'approved' 
                    ? 'Your account is fully verified.' 
                    : status === 'rejected'
                    ? 'Please resubmit required documents.'
                    : 'Your documents are under review.'}
                </p>
                
                <div className="flex gap-2 mt-3">
                  <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning'}>
                    {status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Required Documents</h2>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-900">{doc.name}</span>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Upload New Document</h2>

            <div className="border-2 border-dashed border-slate-300 p-8 text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Drag and drop files here</p>
              <p className="text-sm text-slate-500 mb-4">PDF, JPG, or PNG up to 10MB</p>
              <Button variant="outline">Select File</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
