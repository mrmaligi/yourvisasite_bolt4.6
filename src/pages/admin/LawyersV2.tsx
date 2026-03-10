import { Users, UserCheck, Clock, Briefcase, Star, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminLawyersV2() {
  const lawyers = [
    { id: 1, name: 'Jane Smith', email: 'jane@example.com', status: 'verified', cases: 45, rating: 4.9 },
    { id: 2, name: 'Michael Brown', email: 'michael@example.com', status: 'verified', cases: 32, rating: 4.8 },
    { id: 3, name: 'Sarah Lee', email: 'sarah@example.com', status: 'pending', cases: 0, rating: 0 },
    { id: 4, name: 'David Wilson', email: 'david@example.com', status: 'verified', cases: 28, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Lawyer Management</h1>
          <p className="text-slate-400">Verify and manage lawyers</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Total Lawyers</p>
            <p className="text-2xl font-bold text-slate-900">24</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Verified</p>
            <p className="text-2xl font-bold text-green-600">20</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Pending</p>
            <p className="text-2xl font-bold text-amber-600">4</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Active Cases</p>
            <p className="text-2xl font-bold text-blue-600">156</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Lawyer</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
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
                        <p className="text-sm text-slate-500">{lawyer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      lawyer.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {lawyer.status}
                    </span>
                  </td>
                  <td className="p-4">{lawyer.cases}</td>
                  <td className="p-4">
                    {lawyer.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{lawyer.rating}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {lawyer.status === 'pending' ? (
                      <Button variant="primary" size="sm">Verify</Button>
                    ) : (
                      <Button variant="outline" size="sm">View</Button>
                    )}
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
