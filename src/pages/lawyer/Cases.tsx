import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

interface Case {
  id: string;
  clientName: string;
  visaType: string;
  stage: 'received' | 'processing' | 'assessment' | 'decision';
  lastUpdated: string;
}

const MOCK_CASES: Case[] = [
  { id: '1', clientName: 'Sarah Johnson', visaType: 'Partner Visa (820)', stage: 'received', lastUpdated: '2024-03-20' },
  { id: '2', clientName: 'Michael Chen', visaType: 'Skilled Independent (189)', stage: 'processing', lastUpdated: '2024-03-18' },
  { id: '3', clientName: 'James Rodriguez', visaType: 'Employer Nomination (186)', stage: 'assessment', lastUpdated: '2024-03-15' },
  { id: '4', clientName: 'Emma Wilson', visaType: 'Student Visa (500)', stage: 'decision', lastUpdated: '2024-03-10' },
  { id: '5', clientName: 'David Kim', visaType: 'Partner Visa (801)', stage: 'received', lastUpdated: '2024-03-21' },
];

const COLUMNS = [
  { id: 'received', title: 'Received', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'processing', title: 'Processing', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { id: 'assessment', title: 'Assessment', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'decision', title: 'Decision', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
];

export function Cases() {
  const [cases] = useState<Case[]>(MOCK_CASES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Case Management | VisaBuild</title>
      </Helmet>
      <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Case Management</h1>
            <p className="text-neutral-600 dark:text-neutral-300">Track application progress across stages.</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        <div className="flex-1 overflow-x-auto pb-2">
          <div className="flex gap-6 min-w-[1000px] h-full">
            {COLUMNS.map((col) => (
              <div key={col.id} className="flex-1 flex flex-col bg-neutral-100 dark:bg-neutral-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-700 dark:text-neutral-200">{col.title}</h3>
                    <Badge variant="secondary" className="bg-white dark:bg-neutral-700">
                        {cases.filter(c => c.stage === col.id).length}
                    </Badge>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-xl" />
                        ))
                    ) : (
                        cases.filter(c => c.stage === col.id).map(c => (
                            <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardBody className="p-3">
                                    <p className="font-medium text-neutral-900 dark:text-white text-sm">{c.clientName}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{c.visaType}</p>
                                    <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-700 flex justify-between items-center">
                                        <span className="text-[10px] text-neutral-400">ID: {c.id}</span>
                                        <span className="text-[10px] text-neutral-400">{new Date(c.lastUpdated).toLocaleDateString()}</span>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    )}
                    {!loading && (
                        <Button variant="ghost" className="w-full border-dashed border border-neutral-300 dark:border-neutral-600 text-neutral-500 hover:text-neutral-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                        </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
}
