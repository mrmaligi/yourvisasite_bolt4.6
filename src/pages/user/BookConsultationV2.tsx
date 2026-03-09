import { Clock, Calendar, User, Briefcase } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function BookConsultationV2() {
  const lawyers = [
    { id: 1, name: 'Jane Smith', specialty: 'Partner Visas', rating: 4.9, reviews: 127, price: '$150', image: 'JS' },
    { id: 2, name: 'Bob Wilson', specialty: 'Skilled Migration', rating: 4.8, reviews: 89, price: '$120', image: 'BW' },
    { id: 3, name: 'Sarah Lee', specialty: 'Student Visas', rating: 4.9, reviews: 156, price: '$100', image: 'SL' },
  ];

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Book a Consultation</h1>
          <p className="text-slate-600">Choose a lawyer and schedule your appointment</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600">{lawyer.image}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{lawyer.name}</p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Briefcase className="w-3 h-3" />
                    {lawyer.specialty}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="text-amber-600">★ {lawyer.rating}</span>
                <span className="text-slate-500">({lawyer.reviews} reviews)</span>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Available Times</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.slice(0, 3).map((time) => (
                    <button key={time} className="px-2 py-1 text-xs border border-slate-200 hover:border-blue-500 hover:bg-blue-50">
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-lg font-bold text-slate-900">{lawyer.price}</span>
                <Button variant="primary" size="sm">Book Now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
