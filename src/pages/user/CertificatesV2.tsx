import { Award, CheckCircle, Download, Share2, Linkedin, Twitter } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserCertificatesV2() {
  const certificates = [
    { id: 1, title: 'Australian Visa Basics', issueDate: '2024-03-20', expiryDate: null, credential: 'VB-2024-001' },
    { id: 2, title: 'Document Preparation Masterclass', issueDate: '2024-02-15', expiryDate: null, credential: 'VB-2024-002' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
          <p className="text-slate-600">Your achievements and credentials</p>
        </div>

        <div className="space-y-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white border border-slate-200 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <Award className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Certificate of Completion</p>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-slate-900 text-xl mb-4">{cert.title}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-slate-500">Issue Date</p>
                    <p className="font-medium text-slate-900">{cert.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Credential ID</p>
                    <p className="font-medium text-slate-900">{cert.credential}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4 mr-1" />
                    Add to LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
