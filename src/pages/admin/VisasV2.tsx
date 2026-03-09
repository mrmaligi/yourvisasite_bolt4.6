import { FileText, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminVisasV2() {
  const visas = [
    { id: 1, name: 'Partner Visa', subclass: '820/801', category: 'Family', status: 'Active' },
    { id: 2, name: 'Skilled Independent', subclass: '189', category: 'Skilled', status: 'Active' },
    { id: 3, name: 'Student Visa', subclass: '500', category: 'Student', status: 'Active' },
    { id: 4, name: 'Visitor Visa', subclass: '600', category: 'Visitor', status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Visa Management</h1>
            <p className="text-slate-400">Manage visa types and information</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Visa
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search visas..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Visa</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Subclass</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Category</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visas.map((visa) => (
                <tr key={visa.id}>
                  <td className="p-4 font-medium">{visa.name}</td>
                  <td className="p-4">{visa.subclass}</td>
                  <td className="p-4">{visa.category}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700">{visa.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
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
