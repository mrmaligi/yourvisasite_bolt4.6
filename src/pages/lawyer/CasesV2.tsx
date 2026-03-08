import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

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
];

const STAGES = [
  { id: 'received', title: 'Received', color: 'bg-blue-100 text-blue-700' },
  { id: 'processing', title: 'Processing', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'assessment', title: 'Assessment', color: 'bg-purple-100 text-purple-700' },
  { id: 'decision', title: 'Decision', color: 'bg-green-100 text-green-700' },
];

export function CasesV2() {
  const [cases] = useState<Case[]>(MOCK_CASES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const getCasesByStage = (stage: string) => cases.filter(c => c.stage === stage);

  return (
    <>
      <Helmet>
        <title>Case Management | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Case Management</h1>
                <p className="text-slate-600">Track application progress across stages</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Case
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Kanban Board - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.map((stage) => (
              <div key={stage.id} className="bg-slate-100 border border-slate-200">
                <div className={`p-3 ${stage.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{stage.title}</span>
                    <Badge variant="secondary">{getCasesByStage(stage.id).length}</Badge>
                  </div>
                </div>
                
                <div className="p-3 space-y-3">
                  {loading ? (
                    <div className="h-20 bg-slate-200 animate-pulse"></div>
                  ) : (
                    getCasesByStage(stage.id).map((caseItem) => (
                      <div key={caseItem.id} className="bg-white border border-slate-200 p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-slate-900">{caseItem.clientName}</h3>
                          <button className="text-slate-400 hover:text-slate-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{caseItem.visaType}</p>
                        <p className="text-xs text-slate-500">Updated: {caseItem.lastUpdated}</p>
                      </div>
                    ))
                  )}
                  
                  {!loading && getCasesByStage(stage.id).length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">No cases</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary - SQUARE */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Cases', value: cases.length },
              { label: 'Active', value: cases.filter(c => c.stage !== 'decision').length },
              { label: 'Completed', value: cases.filter(c => c.stage === 'decision').length },
              { label: 'This Week', value: cases.filter(c => new Date(c.lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
