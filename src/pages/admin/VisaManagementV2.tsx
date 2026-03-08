import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function VisaManagementV2() {
  const [visas, setVisas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('visas')
        .select('*')
        .order('subclass', { ascending: true });

      setVisas(data || []);
    } catch (error) {
      console.error('Error fetching visas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisas = visas.filter(visa =>
    visa.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visa.subclass?.includes(searchTerm)
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      work: 'bg-blue-100 text-blue-700',
      family: 'bg-green-100 text-green-700',
      student: 'bg-purple-100 text-purple-700',
      visitor: 'bg-amber-100 text-amber-700',
      business: 'bg-rose-100 text-rose-700',
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  return (
    <>
      <Helmet>
        <title>Visa Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Visa Management</h1>
                <p className="text-slate-600">Manage visa types and information</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Visa
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search visas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Visas', value: visas.length },
              { label: 'Active', value: visas.filter(v => v.is_active).length },
              { label: 'Categories', value: new Set(visas.map(v => v.category)).size },
              { label: 'Premium', value: visas.filter(v => v.has_premium).length },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Visas Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Subclass</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                    </tr>
                  ) : filteredVisas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No visas found</td>
                    </tr>
                  ) : (
                    filteredVisas.map((visa) => (
                      <tr key={visa.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-sm text-slate-900">{visa.subclass}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{visa.name}</p>
                            <p className="text-sm text-slate-500 truncate max-w-xs">{visa.summary}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium ${getCategoryColor(visa.category)}`}>
                            {visa.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={visa.is_active ? 'success' : 'secondary'}>
                            {visa.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="danger">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
