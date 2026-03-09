import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, FileText, Briefcase, StickyNote, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function ClientDetailV2() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'Notes', icon: StickyNote },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{client.name} | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <p className="text-slate-600">{client.visaType}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="success">{client.status}</Badge>
                    <Badge variant="primary">{client.caseStatus}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
                <Button variant="primary">New Case</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Contact Info */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="text-slate-900">{client.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="text-slate-900">{client.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="text-slate-900">{client.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Case Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Client Since</span>
                    <span className="text-slate-900">{client.joinedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Visa Type</span>
                    <span className="text-slate-900">{client.visaType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status</span>
                    <Badge variant="primary">{client.caseStatus}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs - SQUARE */}
              <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-white border border-slate-200 p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                    
                    <div className="space-y-4">
                      {[
                        { action: 'Document uploaded', date: '2024-03-20', type: 'document' },
                        { action: 'Consultation completed', date: '2024-03-15', type: 'consultation' },
                        { action: 'Case status updated', date: '2024-03-10', type: 'status' },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                          <span className="text-slate-700">{activity.action}</span>
                          <span className="text-sm text-slate-500">{activity.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No documents uploaded yet</p>
                    <Button variant="primary" className="mt-4">Upload Document</Button>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Add notes about this client..."
                      rows={6}
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none"
                    />
                    <Button variant="primary">Save Notes</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
