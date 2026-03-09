import { GitBranch, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function WorkflowV2() {
  const workflows = [
    { id: 1, name: 'Article Approval', description: 'Review and approve articles', status: 'active', steps: 3 },
    { id: 2, name: 'Comment Moderation', description: 'Moderate user comments', status: 'active', steps: 2 },
    { id: 3, name: 'User Onboarding', description: 'New user approval process', status: 'inactive', steps: 4 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Workflow</h1>
          <p className="text-slate-600">Manage content workflows</p>
        </div>

        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{workflow.name}</h3>
                      <span className={`px-2 py-0.5 text-xs ${
                        workflow.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {workflow.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{workflow.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{workflow.steps} steps</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
