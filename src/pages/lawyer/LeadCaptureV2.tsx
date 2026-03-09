import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Link as LinkIcon, Eye, Copy, Trash2, Edit, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface LeadForm {
  id: string;
  name: string;
  status: 'active' | 'draft';
  submissions: number;
  lastUpdated: string;
}

const MOCK_FORMS: LeadForm[] = [
  { id: '1', name: 'General Inquiry', status: 'active', submissions: 124, lastUpdated: '2024-03-15' },
  { id: '2', name: 'Partner Visa Assessment', status: 'active', submissions: 45, lastUpdated: '2024-03-10' },
  { id: '3', name: 'Skilled Migration', status: 'draft', submissions: 0, lastUpdated: '2024-03-20' },
];

export function LeadCaptureV2() {
  const [forms] = useState<LeadForm[]>(MOCK_FORMS);

  const stats = {
    total: forms.length,
    active: forms.filter(f => f.status === 'active').length,
    submissions: forms.reduce((acc, f) => acc + f.submissions, 0),
  };

  return (
    <>
      <Helmet>
        <title>Lead Capture | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Lead Capture</h1>
                <p className="text-slate-600">Create and manage forms to capture client leads</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Forms', value: stats.total, icon: LinkIcon },
              { label: 'Active', value: stats.active, icon: LinkIcon, color: 'text-green-600' },
              { label: 'Submissions', value: stats.submissions, icon: Users, color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map(form => (
              <div key={form.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{form.name}</h3>
                    <p className="text-sm text-slate-500">Updated {form.lastUpdated}</p>
                  </div>
                  <Badge variant={form.status === 'active' ? 'success' : 'secondary'}>
                    {form.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{form.submissions} submissions</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
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
