import { FileText, Book, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApiDocsV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">API Documentation</h1>
          <p className="text-slate-600">Reference guide for the VisaBuild API</p>
        </div>

        <div className="space-y-4">
          {[
            { title: 'Getting Started', description: 'Authentication and basic usage', icon: Book },
            { title: 'Visas API', description: 'Endpoints for visa information', icon: FileText },
            { title: 'Users API', description: 'User management endpoints', icon: FileText },
            { title: 'Applications API', description: 'Application submission and tracking', icon: FileText },
            { title: 'Consultations API', description: 'Booking and managing consultations', icon: FileText },
          ].map((doc) => (
            <div key={doc.title} className="bg-white border border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <doc.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{doc.title}</p>
                  <p className="text-sm text-slate-500">{doc.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
