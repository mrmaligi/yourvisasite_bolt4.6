import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, FileJson, ExternalLink, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Visa {
  id: string;
  subclass: string;
  name: string;
  country: string;
  category: string;
  isActive: boolean;
}

const MOCK_VISAS: Visa[] = [
  { id: '1', subclass: '820', name: 'Partner Visa', country: 'Australia', category: 'family', isActive: true },
  { id: '2', subclass: '189', name: 'Skilled Independent', country: 'Australia', category: 'work', isActive: true },
  { id: '3', subclass: '500', name: 'Student Visa', country: 'Australia', category: 'student', isActive: true },
  { id: '4', subclass: '600', name: 'Visitor Visa', country: 'Australia', category: 'visitor', isActive: false },
];

export function VisaManagementV2() {
  const [visas] = useState<Visa[]>(MOCK_VISAS);
  const [search, setSearch] = useState('');

  const filteredVisas = visas.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.subclass.includes(search)
  );

  const stats = {
    total: visas.length,
    active: visas.filter(v => v.isActive).length,
    inactive: visas.filter(v => !v.isActive).length,
  };

  return (
    <>
      <Helmet>
        <title>Visa Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Visa Management</h1>
                <p className="text-slate-600">Manage visa types and categories</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <FileJson className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Visa
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Visas', value: stats.total },
              { label: 'Active', value: stats.active, color: 'text-green-600' },
              { label: 'Inactive', value: stats.inactive, color: 'text-slate-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className={`text-2xl font-bold ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search visas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Subclass</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredVisas.map((visa) => (
                    <tr key={visa.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{visa.subclass}</td>
                      <td className="px-6 py-4 text-slate-700">{visa.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs capitalize">
                          {visa.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={visa.isActive ? 'success' : 'secondary'}>
                          {visa.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
