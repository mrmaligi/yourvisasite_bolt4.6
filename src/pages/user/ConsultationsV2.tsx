import { Users, MessageSquare, Calendar, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserConsultationsV2() {
  const consultations = [
    { id: 1, lawyer: 'Jane Smith', specialty: 'Partner Visas', date: '2024-03-25', time: '10:00 AM', status: 'upcoming', type: 'Video' },
    { id: 2, lawyer: 'Bob Wilson', specialty: 'Skilled Migration', date: '2024-03-20', time: '2:00 PM', status: 'completed', type: 'Phone' },
    { id: 3, lawyer: 'Sarah Lee', specialty: 'Student Visas', date: '2024-03-10', time: '11:00 AM', status: 'completed', type: 'Video' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Consultations</h1>
            <p className="text-slate-600">Manage your appointments with lawyers</p>
          </div>
          <Button variant="primary">Book Consultation</Button>
        </div>

        <div className="space-y-4">
          {consultations.map((consult) => (
            <div key={consult.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">{consult.lawyer.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{consult.lawyer}</p>
                    <p className="text-sm text-slate-500">{consult.specialty}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {consult.date}</span>
                      <span>{consult.time}</span>
                      <span className="text-slate-400">•</span>
                      <span>{consult.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-xs font-medium ${
                    consult.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {consult.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
