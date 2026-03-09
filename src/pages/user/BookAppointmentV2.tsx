import { Calendar, Clock, Video, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function BookAppointmentV2() {
  const lawyers = [
    { id: 1, name: 'Jane Smith', specialty: 'Partner Visa Expert', rating: 4.9, reviews: 128 },
    { id: 2, name: 'Michael Brown', specialty: 'Skilled Migration', rating: 4.8, reviews: 96 },
    { id: 3, name: 'Sarah Lee', specialty: 'Business Visa', rating: 4.7, reviews: 84 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Book Appointment</h1>
          <p className="text-slate-400">Schedule a consultation with a lawyer</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-white border border-slate-200 p-6">
              <div className="w-16 h-16 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">{lawyer.name.charAt(0)}</span>
              </div>
              
              <p className="text-center font-semibold text-slate-900">{lawyer.name}</p>
              <p className="text-center text-sm text-slate-500 mb-2">{lawyer.specialty}</p>
              
              <div className="flex items-center justify-center gap-1 mb-4">
                <span className="text-amber-500">★</span>
                <span className="text-sm text-slate-600">{lawyer.rating} ({lawyer.reviews} reviews)</span>
              </div>

              <div className="space-y-2 text-sm text-slate-500 mb-4">
                <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> 30 min consultation</p>
                <p className="flex items-center gap-2"><Video className="w-4 h-4" /> Video call</p>
                <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Available today</p>
              </div>

              <Button variant="primary" className="w-full">Book Now</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
