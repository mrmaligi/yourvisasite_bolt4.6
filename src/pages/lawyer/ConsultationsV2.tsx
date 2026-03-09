import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, CheckCircle, XCircle, Video } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Consultation {
  id: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

const MOCK_CONSULTATIONS: Consultation[] = [
  { id: '1', clientName: 'Sarah Johnson', date: '2024-03-25', time: '10:00 AM', duration: 60, type: 'Partner Visa', status: 'confirmed', notes: 'Initial consultation' },
  { id: '2', clientName: 'Michael Chen', date: '2024-03-26', time: '2:00 PM', duration: 45, type: 'Skilled Migration', status: 'pending', notes: '' },
  { id: '3', clientName: 'Emma Wilson', date: '2024-03-20', time: '11:00 AM', duration: 60, type: 'Student Visa', status: 'completed', notes: 'Document review completed' },
];

export function ConsultationsV2() {
  const [consultations] = useState<Consultation[]>(MOCK_CONSULTATIONS);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredConsultations = consultations.filter(c => {
    if (activeTab === 'upcoming') {
      return ['pending', 'confirmed'].includes(c.status);
    }
    return ['completed', 'cancelled'].includes(c.status);
  });

  const stats = {
    upcoming: consultations.filter(c => ['pending', 'confirmed'].includes(c.status)).length,
    completed: consultations.filter(c => c.status === 'completed').length,
    cancelled: consultations.filter(c => c.status === 'cancelled').length,
  };

  return (
    <>
      <Helmet>
        <title>Consultations | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Consultations</h1>
                <p className="text-slate-600">Manage your client appointments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Upcoming', value: stats.upcoming, color: 'text-blue-600' },
              { label: 'Completed', value: stats.completed, color: 'text-green-600' },
              { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {['upcoming', 'past'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'upcoming' | 'past')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredConsultations.map((consultation) => (
              <div key={consultation.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <p className="font-semibold text-slate-900">{consultation.clientName}</p>
                      <p className="text-slate-600">{consultation.type}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {consultation.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {consultation.time} ({consultation.duration} min)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      consultation.status === 'confirmed' ? 'success' :
                      consultation.status === 'pending' ? 'warning' :
                      consultation.status === 'completed' ? 'primary' : 'danger'
                    }>
                      {consultation.status}
                    </Badge>
                  </div>
                </div>

                {consultation.notes && (
                  <p className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 border border-slate-200">
                    {consultation.notes}
                  </p>
                )}

                {consultation.status === 'confirmed' && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="primary" size="sm">
                      <Video className="w-4 h-4 mr-1" />
                      Join Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
