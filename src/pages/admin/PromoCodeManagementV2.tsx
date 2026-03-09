import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Tag, Percent, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  uses: number;
  expiresAt: string;
}

const MOCK_CODES: PromoCode[] = [
  { id: '1', code: 'WELCOME20', discount: 20, isActive: true, uses: 45, expiresAt: '2024-12-31' },
  { id: '2', code: 'SUMMER15', discount: 15, isActive: true, uses: 23, expiresAt: '2024-06-30' },
  { id: '3', code: 'FLASH50', discount: 50, isActive: false, uses: 100, expiresAt: '2024-03-01' },
];

export function PromoCodeManagementV2() {
  const [codes] = useState<PromoCode[]>(MOCK_CODES);
  const [showCreate, setShowCreate] = useState(false);

  const stats = {
    total: codes.length,
    active: codes.filter(c => c.isActive).length,
    totalUses: codes.reduce((sum, c) => sum + c.uses, 0),
  };

  return (
    <>
      <Helmet>
        <title>Promo Codes | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Promo Code Management</h1>
                <p className="text-slate-600">Create and manage discount codes</p>
              </div>
              <Button variant="primary" onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Code
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Codes', value: stats.total, icon: Tag },
              { label: 'Active', value: stats.active, icon: Percent },
              { label: 'Total Uses', value: stats.totalUses, icon: Calendar },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Form - SQUARE */}
          {showCreate && (
            <div className="bg-white border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Create New Promo Code</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                  <input type="text" placeholder="WELCOME20" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Discount %</label>
                  <input type="number" placeholder="20" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expires</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="primary">Create</Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Codes Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Code</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Discount</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Uses</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Expires</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {codes.map((code) => (
                    <tr key={code.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-slate-400" />
                          <span className="font-mono font-medium text-slate-900">{code.code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-medium">{code.discount}% OFF</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={code.isActive ? 'success' : 'secondary'}>
                          {code.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{code.uses}</td>
                      <td className="px-6 py-4 text-slate-600">{code.expiresAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            {code.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button variant="danger" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
