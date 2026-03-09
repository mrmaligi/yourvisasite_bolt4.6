import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Plus, ArrowRight, Play, Settings } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'inactive';
}

const MOCK_AUTOMATIONS: Automation[] = [
  { id: '1', name: 'Auto-Reply to New Leads', trigger: 'New Lead Created', action: 'Send Email', status: 'active' },
  { id: '2', name: 'Task Creation for Consultation', trigger: 'Booking Confirmed', action: 'Create Task', status: 'active' },
  { id: '3', name: 'Request Review After Case Closed', trigger: 'Case Status: Closed', action: 'Send Email (Delay 2d)', status: 'inactive' },
];

export function AutomationV2() {
  const [automations] = useState<Automation[]>(MOCK_AUTOMATIONS);

  const stats = {
    total: automations.length,
    active: automations.filter(a => a.status === 'active').length,
    inactive: automations.filter(a => a.status === 'inactive').length,
  };

  return (
    <>
      <Helmet>
        <title>Automation | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Workflow Automation</h1>
                <p className="text-slate-600">Streamline repetitive tasks</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Automation
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Zap },
              { label: 'Active', value: stats.active, icon: Play, color: 'text-green-600' },
              { label: 'Inactive', value: stats.inactive, icon: Settings, color: 'text-slate-600' },
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

          <div className="space-y-4">
            {automations.map((auto) => (
              <div key={auto.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 flex items-center justify-center ${
                    auto.status === 'active' ? 'bg-yellow-100' : 'bg-slate-100'
                  }`}>
                    <Zap className={`w-6 h-6 ${auto.status === 'active' ? 'text-yellow-600' : 'text-slate-400'}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">{auto.name}</h3>
                      <Badge variant={auto.status === 'active' ? 'success' : 'secondary'}>
                        {auto.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <span className="bg-slate-100 px-2 py-1 border border-slate-200">{auto.trigger}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span className="bg-slate-100 px-2 py-1 border border-slate-200">{auto.action}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
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
