import { MapPin, Clock, Globe, Building, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserLocationsV2() {
  const locations = [
    { id: 1, name: 'Sydney Office', address: '123 George Street, Sydney NSW 2000', hours: 'Mon-Fri 9am-5pm', type: 'Head Office' },
    { id: 2, name: 'Melbourne Office', address: '456 Collins Street, Melbourne VIC 3000', hours: 'Mon-Fri 9am-5pm', type: 'Branch' },
    { id: 3, name: 'Brisbane Office', address: '789 Queen Street, Brisbane QLD 4000', hours: 'Mon-Fri 9am-5pm', type: 'Branch' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Our Locations</h1>
          <p className="text-slate-600">Visit us at one of our offices across Australia</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-white border border-slate-200 p-6">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">{loc.type}</span>
              <h3 className="font-semibold text-slate-900 mt-1 mb-2">{loc.name}</h3>
              
              <div className="space-y-2 text-sm text-slate-600">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {loc.address}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {loc.hours}
                </p>
              </div>
              
              <Button variant="outline" size="sm" className="mt-4 w-full">Get Directions</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
