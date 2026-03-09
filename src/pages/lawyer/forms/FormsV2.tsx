import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormInput, Plus, Share2, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Form {
  id: string;
  title: string;
  submissions: number;
  status: 'active' | 'draft';
}

const MOCK_FORMS: Form[] = [
  { id: '1', title: 'New Client Intake', submissions: 45, status: 'active' },
  { id: '2', title: 'Feedback Survey', submissions: 12, status: 'active' },
  { id: '3', title: 'Incident Report', submissions: 0, status: 'draft' },
];

export function FormsV2() {
  const [forms] = useState<Form[]>(MOCK_FORMS);

  const stats = {
    total: forms.length,
    active: forms.filter(f => f.status === 'active').length,
    totalSubmissions: forms.reduce((sum, f) => sum + f.submissions, 0),
  };

  return (
    <>
      <Helmet>
        <title>Forms | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Custom Forms</h1>
                <p className="text-slate-600">Collect data from clients securely</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Forms', value: stats.total },
              { label: 'Active', value: stats.active },
              { label: 'Submissions', value: stats.totalSubmissions },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {forms.map((form) => (
              <div key={form.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
                      <FormInput className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{form.title}</h3>
                      <p className="text-sm text-slate-500">{form.submissions} submissions</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={form.status === 'active' ? 'success' : 'secondary'}>
                      {form.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
