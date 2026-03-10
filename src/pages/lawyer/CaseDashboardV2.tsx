import { Briefcase, CheckSquare, Clock, AlertCircle, FileText, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CaseDashboardV2() {
  const stats = [
    { label: 'Active Cases', value: '24', change: '+3', color: 'blue' },
    { label: 'Pending Review', value: '8', change: '+2', color: 'amber' },
    { label: 'Submitted', value: '12', change: '+1', color: 'green' },
    { label: 'Urgent', value: '3', change: '-1', color: 'red' },
  ];

  const recentCases = [
    { id: 'C-001', client: 'John Doe', type: 'Partner Visa', status: 'In Progress', due: '2 days' },
    { id: 'C-002', client: 'Jane Smith', type: 'Skilled Independent', status: 'Pending Documents', due: '5 days' },
    { id: 'C-003', client: 'Bob Wilson', type: 'Student Visa', status: 'Submitted', due: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Case Dashboard</h1>
          <p className="text-slate-400">Overview of all your cases</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-6">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Cases</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Case ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Client</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Type</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentCases.map((c) => (
                <tr key={c.id}>
                  <td className="p-4 font-medium text-slate-900">{c.id}</td>
                  <td className="p-4">{c.client}</td>
                  <td className="p-4">{c.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      c.status === 'Submitted' ? 'bg-green-100 text-green-700' :
                      c.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{c.status}</span>
                  </td>
                  <td className="p-4">{c.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
