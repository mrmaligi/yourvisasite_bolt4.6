import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Plus, Edit, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Contract {
  id: string;
  name: string;
  lastModified: string;
  status: 'active' | 'draft';
}

const MOCK_CONTRACTS: Contract[] = [
  { id: '1', name: 'Service Agreement - Standard', lastModified: '2024-03-01', status: 'active' },
  { id: '2', name: 'Consultation Waiver', lastModified: '2024-02-15', status: 'active' },
  { id: '3', name: 'Privacy Consent Form', lastModified: '2024-01-20', status: 'draft' },
];

export function ContractsV2() {
  const [contracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [selected, setSelected] = useState<Contract | null>(null);

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    drafts: contracts.filter(c => c.status === 'draft').length,
  };

  return (
    <>
      <Helmet>
        <title>Contracts | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Contracts</h1>
                <p className="text-slate-600">Manage legal templates and agreements</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: FileText },
              { label: 'Active', value: stats.active, icon: FileText, color: 'text-green-600' },
              { label: 'Drafts', value: stats.drafts, icon: FileText, color: 'text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Templates</h2>
              </div>
              
              <div className="divide-y divide-slate-200">
                {contracts.map((contract) => (
                  <button
                    key={contract.id}
                    onClick={() => setSelected(contract)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                      selected?.id === contract.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 truncate">{contract.name}</p>
                      <p className="text-xs text-slate-500">Modified: {contract.lastModified}</p>
                    </div>
                    <Badge variant={contract.status === 'active' ? 'success' : 'secondary'} size="sm">
                      {contract.status}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200">
              {selected ? (
                <>
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">{selected.name}</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-slate-50 border border-slate-200 p-4 h-96">
                      <p className="text-slate-500">Contract content preview...</p>
                      <p className="text-slate-400 mt-4">Terms and Conditions for {selected.name}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-96 text-slate-400">
                  <p>Select a contract to view</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
