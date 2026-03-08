import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, Video, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function ConsultationsV2() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const consultations = [
    {
      id: '1',
      clientName: 'John Smith',
      visaType: 'Partner Visa',
      date: '2024-03-25',
      time: '10:00 AM',
      duration: '30 min',
      status: 'confirmed',
      type: 'video',
    },
    {
      id: '2',
      clientName: 'Emma Davis',
      visaType: 'Skilled Independent',
      date: '2024-03-26',
      time: '2:00 PM',
      duration: '45 min',
      status: 'pending',
      type: 'chat',
    },
    {
      id: '3',
      clientName: 'Michael Brown',
      visaType: 'Student Visa',
      date: '2024-03-20',
      time: '11:00 AM',
      duration: '30 min',
      status: 'completed',
      type: 'video',
    },
  ];

  const filteredConsultations = consultations.filter(c => {
    if (activeTab === 'upcoming') {
      return ['confirmed', 'pending'].includes(c.status);
    }
    return ['completed', 'cancelled'].includes(c.status);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge variant="success">Confirmed</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'completed': return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Consultations | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Consultations</h1>
                <p className="text-slate-600">Manage your client consultations</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs - SQUARE */}
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past
            </button>
          </div>

          {/* Consultations List - SQUARE */}
          <div className="space-y-4">
            {filteredConsultations.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 text-center">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No {activeTab} consultations</p>
              </div>
            ) : (
              filteredConsultations.map((consultation) => (
                <div key={consultation.id} className="bg-white border border-slate-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                        {consultation.type === 'video' ? (
                          <Video className="w-6 h-6 text-blue-600" />
                        ) : (
                          <MessageSquare className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-900">{consultation.clientName}</h3>
                        <p className="text-slate-600 text-sm">{consultation.visaType}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {consultation.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {consultation.time} ({consultation.duration})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(consultation.status)}
                      
                      {activeTab === 'upcoming' && consultation.status === 'confirmed' && (
                        <>
                          <Button variant="primary" size="sm">Join</Button>
                          <Button variant="outline" size="sm">Reschedule</Button>
                        </>
                      )}
                      
                      {activeTab === 'upcoming' && consultation.status === 'pending' && (
                        <>
                          <Button variant="primary" size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirm
                          </Button>
                          <Button variant="danger" size="sm">
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
