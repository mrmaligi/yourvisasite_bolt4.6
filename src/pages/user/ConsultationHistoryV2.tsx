import { Calendar, Clock, Video, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ConsultationHistoryV2() {
  const consultations = [
    { id: 1, lawyer: 'Jane Smith', date: '2024-03-15', time: '10:00 AM', type: 'Video Call', status: 'completed', notes: 'Discussed partner visa options' },
    { id: 2, lawyer: 'Bob Wilson', date: '2024-02-28', time: '2:00 PM', type: 'Chat', status: 'completed', notes: 'Document review questions' },
    { id: 3, lawyer: 'Jane Smith', date: '2024-02-10', time: '11:00 AM', type: 'Video Call', status: 'completed', notes: 'Initial consultation' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'Video Call': return <Video className="w-4 h-4" />;
      case 'Chat': return <MessageSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Consultation History</h1>
          <p className="text-slate-600">View your past consultations</p>
        </div>

        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <span className="font-medium text-blue-600">{consultation.lawyer.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{consultation.lawyer}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {consultation.date}
                        <Clock className="w-4 h-4 ml-2" />
                        {consultation.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-slate-50">
                    <p className="text-sm text-slate-600">{consultation.notes}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-green-100 text-green-700">
                    {getIcon(consultation.type)}
                    {consultation.type}
                  </span>
                  <Button variant="outline" size="sm" className="mt-2 block">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
