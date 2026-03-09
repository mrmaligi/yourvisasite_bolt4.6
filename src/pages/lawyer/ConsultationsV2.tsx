import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Consultation {
  id: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  type: string;
}

const MOCK_CONSULTATIONS: Consultation[] = [
  { id: '1', clientName: 'John Smith', date: '2024-03-25', time: '10:00 AM', duration: 60, status: 'confirmed', type: 'Initial Consultation' },
  { id: '2', clientName: 'Sarah Lee', date: '2024-03-26', time: '2:00 PM', duration: 30, status: 'pending', type: 'Follow-up' },
  { id: '3', clientName: 'Mike Chen', date: '2024-03-20', time: '11:00 AM', duration: 60, status: 'completed', type: 'Case Review' },
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
    total: consultations.length,
    upcoming: consultations.filter(c => ['pending', 'confirmed'].includes(c.status)).length,
    completed: consultations.filter(c => c.status === 'completed').length,
    cancelled: consultations.filter(c => c.status === 'cancelled').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'warning' | 'success' | 'secondary' | 'danger'> = {
      pending: 'warning',
      confirmed: 'success',
      completed: 'secondary',
      cancelled: 'danger',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Consultations | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Consultations</h1>
                <p className="text-slate-600">Manage your appointments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Calendar },
              { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'text-blue-600' },
              { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600' },
              { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'text-red-600' },
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
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-900">{consultation.clientName}</h3>
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
                    {getStatusBadge(consultation.status)}
                    
                    {consultation.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button variant="primary" size="sm">Confirm</Button>
                        <Button variant="outline" size="sm">Cancel</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
