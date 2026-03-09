import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Briefcase, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function ClientDetailV2() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const client = {
    id: id || '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+61 400 123 456',
    address: '123 George St, Sydney NSW 2000',
    joinedAt: '2023-01-15',
    status: 'active',
    visaType: 'Partner Visa (820)',
    caseStatus: 'In Progress',
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'cases', label: 'Cases' },
    { id: 'documents', label: 'Documents' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <>
      <Helmet>
        <title>{client.name} | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{client.name.charAt(0)}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
                  <p className="text-slate-600">Client since {client.joinedAt}</p>
                </div>
              </div>
              
              <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                {client.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">{client.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">{client.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">{client.address}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Case</h2>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <p className="font-medium text-slate-900">{client.visaType}</p>
                    <Badge variant="warning">{client.caseStatus}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Case History</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Partner Visa (820)', status: 'In Progress', date: '2024-03-01' },
                  { name: 'Initial Consultation', status: 'Completed', date: '2024-02-15' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{c.name}</p>
                        <p className="text-sm text-slate-500">{c.date}</p>
                      </div>
                    </div>
                    
                    <Badge variant={c.status === 'Completed' ? 'success' : 'warning'}>
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Shared Documents</h2>
              
              <div className="space-y-3">
                {[
                  { name: 'Passport_Copy.pdf', size: '2.4 MB', date: '2024-03-20' },
                  { name: 'Marriage_Certificate.pdf', size: '1.2 MB', date: '2024-03-18' },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-sm text-slate-500">{doc.size} • {doc.date}</p>
                    </div>
                    
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes</h2>
              
              <textarea 
                className="w-full h-48 p-4 border border-slate-200"
                placeholder="Add notes about this client..."
              />
              
              <div className="mt-4 flex justify-end">
                <Button variant="primary">Save Notes</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
