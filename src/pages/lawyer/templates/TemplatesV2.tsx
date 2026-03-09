import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Plus, Copy, Download, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Template {
  id: string;
  name: string;
  category: string;
  lastEdited: string;
}

const MOCK_TEMPLATES: Template[] = [
  { id: '1', name: 'Standard Retainer Agreement', category: 'Agreements', lastEdited: '2 days ago' },
  { id: '2', name: 'Client Intake Form', category: 'Forms', lastEdited: '1 week ago' },
  { id: '3', name: 'Invoice Template - Hourly', category: 'Billing', lastEdited: '1 month ago' },
];

export function TemplatesV2() {
  const [templates] = useState<Template[]>(MOCK_TEMPLATES);

  const stats = {
    total: templates.length,
    categories: new Set(templates.map(t => t.category)).size,
  };

  return (
    <>
      <Helmet>
        <title>Templates | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Document Templates</h1>
                <p className="text-slate-600">Reusable documents for your practice</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  <p className="text-sm text-slate-600">Templates</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 flex items-center justify-center">
                  <Copy className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.categories}</p>
                  <p className="text-sm text-slate-600">Categories</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white border border-slate-200 p-6 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>

                <h3 className="font-semibold text-slate-900 mb-2">{template.name}</h3>
                <p className="text-sm text-slate-500 mb-4">Last edited {template.lastEdited}</p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
