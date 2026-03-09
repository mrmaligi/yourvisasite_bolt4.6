import { Briefcase, Plus, Search, Filter, MoreHorizontal, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function MyCasesV2() {
  const cases = [
    { id: 'C-001', client: 'John Doe', type: 'Partner Visa', status: 'In Progress', dueDate: 'Apr 15, 2024' },
    { id: 'C-002', client: 'Jane Smith', type: 'Skilled Independent', status: 'Submitted', dueDate: 'Mar 30, 2024' },
    { id: 'C-003', client: 'Bob Wilson', type: 'Student Visa', status: 'Pending Documents', dueDate: 'Apr 5, 2024' },
    { id: 'C-004', client: 'Alice Brown', type: 'Visitor Visa', status: 'Approved', dueDate: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Cases</h1>
            <p className="text-slate-400">Manage your active cases</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search cases..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
          <button className="px-4 py-2 border border-slate-200 bg-white flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Case ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Client</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Type</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Due Date</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cases.map((c) => (
                <tr key={c.id}>
                  <td className="p-4 font-medium text-slate-900">{c.id}</td>
                  <td className="p-4">{c.client}</td>
                  <td className="p-4">{c.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      c.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      c.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                      c.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{c.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className={c.dueDate === 'Completed' ? 'text-green-600' : 'text-slate-600'}>{c.dueDate}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
