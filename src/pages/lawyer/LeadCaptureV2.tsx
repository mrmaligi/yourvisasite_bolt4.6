import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Link as LinkIcon, Eye, Copy, Trash2, Edit, TrendingUp } from 'lucide-react';
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

  const totalSubmissions = forms.reduce((sum, f) => sum + f.submissions, 0);
  const activeForms = forms.filter(f => f.status === 'active').length;

  return (
    <>
      <Helmet>
        <title>Lead Capture | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Lead Capture</h1>
                <p className="text-slate-600">Create forms to capture client leads</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Forms', value: forms.length, icon: LinkIcon },
              { label: 'Active Forms', value: activeForms, icon: Eye },
              { label: 'Total Submissions', value: totalSubmissions, icon: TrendingUp },
              { label: 'Conversion Rate', value: '12%', icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Forms Grid - SQUARE */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div key={form.id} className="bg-white border border-slate-200 p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant={form.status === 'active' ? 'success' : 'secondary'}>
                    {form.status}
                  </Badge>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1">{form.name}</h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <span>{form.submissions} submissions</span>
                  <span>Updated: {form.lastUpdated}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Link
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm">
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
