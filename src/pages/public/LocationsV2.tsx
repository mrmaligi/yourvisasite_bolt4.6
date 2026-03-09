import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

export function LocationsV2() {
  const offices = [
    { 
      city: 'Sydney', 
      address: '123 Martin Place, Sydney NSW 2000',
      phone: '+61 2 1234 5678',
      email: 'sydney@visabuild.com',
      hours: 'Mon-Fri: 9am-5pm'
    },
    { 
      city: 'Melbourne', 
      address: '456 Collins Street, Melbourne VIC 3000',
      phone: '+61 3 9876 5432',
      email: 'melbourne@visabuild.com',
      hours: 'Mon-Fri: 9am-5pm'
    },
    { 
      city: 'Brisbane', 
      address: '789 Queen Street, Brisbane QLD 4000',
      phone: '+61 7 3456 7890',
      email: 'brisbane@visabuild.com',
      hours: 'Mon-Fri: 9am-5pm'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Our Locations</h1>
          <p className="text-slate-400">Visit us at one of our offices</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {offices.map((office) => (
            <div key={office.city} className="bg-white border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">{office.city}</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <span className="text-slate-600">{office.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">{office.phone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">{office.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">{office.hours}</span>
                </div>
              </div>

              <button className="mt-6 w-full py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                Get Directions
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
