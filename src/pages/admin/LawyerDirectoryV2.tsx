import { Users, UserPlus, Search, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerDirectoryV2() {
  const lawyers = [
    { id: 1, name: 'Jane Smith', firm: 'Smith Immigration', email: 'jane@example.com', phone: '+61 2 1234 5678', cases: 45, rating: 4.9 },
    { id: 2, name: 'Michael Brown', firm: 'Brown Legal', email: 'michael@example.com', phone: '+61 3 9876 5432', cases: 32, rating: 4.8 },
    { id: 3, name: 'Sarah Lee', firm: 'Lee & Associates', email: 'sarah@example.com', phone: '+61 7 3456 7890', cases: 28, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Lawyer Directory</h1>
            <p className="text-slate-400">Manage registered lawyers</p>
          </div>
          <Button variant="primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Lawyer
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search lawyers..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Lawyer</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Contact</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Cases</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Rating</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {lawyers.map((lawyer) => (
                <tr key={lawyer.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">{lawyer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{lawyer.name}</p>
                        <p className="text-sm text-slate-500">{lawyer.firm}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-slate-600"><Mail className="w-3 h-3" /> {lawyer.email}</div>
                      <div className="flex items-center gap-1 text-slate-500"><Phone className="w-3 h-3" /> {lawyer.phone}</div>
                    </div>
                  </td>
                  <td className="p-4">{lawyer.cases} active</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span>{lawyer.rating}</span>
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
