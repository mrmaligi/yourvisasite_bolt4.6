import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Folder, Clock, CheckCircle } from 'lucide-react';
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
  { id: '5', clientName: 'David Kim', visaType: 'Partner Visa (801)', stage: 'received', lastUpdated: '2024-03-21' },
];

const STAGES = [
  { id: 'received', title: 'Received', color: 'bg-blue-100 text-blue-700' },
  { id: 'processing', title: 'Processing', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'assessment', title: 'Assessment', color: 'bg-purple-100 text-purple-700' },
  { id: 'decision', title: 'Decision', color: 'bg-green-100 text-green-700' },
];

export function CasesV2() {
  const [cases] = useState<Case[]>(MOCK_CASES);

  const stats = {
    total: cases.length,
    received: cases.filter(c => c.stage === 'received').length,
    processing: cases.filter(c => c.stage === 'processing').length,
    assessment: cases.filter(c => c.stage === 'assessment').length,
    decision: cases.filter(c => c.stage === 'decision').length,
  };

  const getCasesByStage = (stage: string) => cases.filter(c => c.stage === stage);

  return (
    <>
      <Helmet>
        <title>Case Management | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Folder },
              { label: 'Received', value: stats.received, icon: Folder, color: 'text-blue-600' },
              { label: 'Processing', value: stats.processing, icon: Clock, color: 'text-yellow-600' },
              { label: 'Assessment', value: stats.assessment, icon: Clock, color: 'text-purple-600' },
              { label: 'Decision', value: stats.decision, icon: CheckCircle, color: 'text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {STAGES.map((stage) => (
              <div key={stage.id} className="bg-white border border-slate-200">
                <div className={`p-3 ${stage.color}`}>
                  <h3 className="font-semibold">{stage.title}</h3>
                  <p className="text-sm">{getCasesByStage(stage.id).length} cases</p>
                </div>
                
                <div className="p-3 space-y-3">
                  {getCasesByStage(stage.id).map((c) => (
                    <div key={c.id} className="bg-slate-50 border border-slate-200 p-3">
                      <p className="font-medium text-slate-900">{c.clientName}</p>
                      <p className="text-sm text-slate-600">{c.visaType}</p>
                      <p className="text-xs text-slate-500 mt-1">Updated: {c.lastUpdated}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
