import { Briefcase, Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerCasesV2() {
  const cases = [
    { id: 'C-001', client: 'John Doe', type: 'Partner Visa', status: 'In Progress', date: '2024-03-15' },
    { id: 'C-002', client: 'Jane Smith', type: 'Skilled Independent', status: 'Submitted', date: '2024-03-10' },
    { id: 'C-003', client: 'Bob Wilson', type: 'Student Visa', status: 'Pending', date: '2024-03-05' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Cases</h1>
            <p className="text-slate-400">Manage your client cases</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-4 mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search cases..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
          <select className="px-4 py-2 border border-slate-200">
            <option>All Status</option>
            <option>In Progress</option>
            <option>Submitted</option>
          </select>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Case ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Client</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Type</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cases.map((c) => (
                <tr key={c.id}>
                  <td className="p-4 font-medium">{c.id}</td>
                  <td className="p-4">{c.client}</td>
                  <td className="p-4">{c.type}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">{c.status}</span>
                  </td>
                  <td className="p-4">{c.date}</td>
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
