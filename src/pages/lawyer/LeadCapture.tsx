import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Link as LinkIcon, Eye, Copy, Trash2, Edit } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

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

export function LeadCapture() {
  const [forms] = useState<LeadForm[]>(MOCK_FORMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Lead Capture | VisaBuild</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Lead Capture</h1>
            <p className="text-neutral-600 dark:text-neutral-300">Create and manage forms to capture client leads.</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                ))
            ) : (
                forms.map(form => (
                    <Card key={form.id} className="group hover:border-primary-300 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Badge variant={form.status === 'active' ? 'success' : 'default'}>
                                {form.status}
                            </Badge>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-neutral-100 rounded text-neutral-500">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1 hover:bg-red-50 rounded text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">{form.name}</h3>
                            <p className="text-sm text-neutral-500 mb-4">Last updated {new Date(form.lastUpdated).toLocaleDateString()}</p>

                            <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-700">
                                <div className="text-center">
                                    <span className="block text-xl font-bold text-neutral-900 dark:text-white">{form.submissions}</span>
                                    <span className="text-xs text-neutral-500">Submissions</span>
                                </div>
                                <Button variant="secondary" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Leads
                                </Button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                 <div className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                    <LinkIcon className="w-4 h-4 text-neutral-400" />
                                    <span className="text-xs text-neutral-500 truncate flex-1">visabuild.com/f/{form.id}</span>
                                    <button className="p-1 hover:bg-white rounded text-neutral-400 hover:text-neutral-600">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                 </div>
                            </div>
                        </CardBody>
                    </Card>
                ))
            )}

            {/* New Form Placeholder Card */}
            <button className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all text-neutral-400 hover:text-primary-600">
                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6" />
                </div>
                <span className="font-medium">Create New Form</span>
            </button>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
}
