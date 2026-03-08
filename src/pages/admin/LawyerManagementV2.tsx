import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, CheckCircle, XCircle, Star, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function LawyerManagementV2() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    const { data } = await supabase
      .from('lawyer_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    setLawyers(data || []);
    setLoading(false);
  };

  const filteredLawyers = lawyers.filter(lawyer =>
    lawyer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: lawyers.length,
    pending: lawyers.filter(l => l.verification_status === 'pending').length,
    approved: lawyers.filter(l => l.verification_status === 'approved').length,
    rejected: lawyers.filter(l => l.verification_status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Lawyer Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Lawyer Management</h1>
                <p className="text-slate-600">Review and manage lawyer applications</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
              { label: 'Pending', value: stats.pending, icon: Star, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
              { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-100 text-red-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search lawyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Lawyers Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Lawyer</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Location</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Joined</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                    </tr>
                  ) : filteredLawyers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No lawyers found</td>
                    </tr>
                  ) : (
                    filteredLawyers.map((lawyer) => (
                      <tr key={lawyer.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                              {lawyer.full_name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{lawyer.full_name || 'Unknown'}</p>
                              <p className="text-sm text-slate-500">{lawyer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(lawyer.verification_status)}</td>
                        <td className="px-6 py-4 text-slate-600">{lawyer.city || 'Not set'}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(lawyer.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            {lawyer.verification_status === 'pending' && (
                              <>
                                <Button variant="primary" size="sm">Approve</Button>
                                <Button variant="danger" size="sm">Reject</Button>
                              </>
                            )}
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
