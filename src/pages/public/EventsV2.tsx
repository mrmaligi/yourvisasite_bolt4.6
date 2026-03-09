import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, Users, ArrowRight, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const EVENTS = [
  { id: 1, title: 'Migration Expo 2024', date: 'Nov 12, 2024', location: 'ICC Sydney', type: 'In-Person', attendees: '2000+' },
  { id: 2, title: 'International Student Fair', date: 'Oct 25, 2024', location: 'Online', type: 'Virtual', attendees: '500+' },
  { id: 3, title: 'Investor Visa Seminar', date: 'Oct 18, 2024', location: 'Federation Square', type: 'In-Person', attendees: '150+' },
  { id: 4, title: 'New Migrants Networking Night', date: 'Oct 30, 2024', location: 'Brisbane', type: 'Networking', attendees: '80+' },
  { id: 5, title: 'Online Visa Workshop', date: 'Nov 05, 2024', location: 'Zoom', type: 'Workshop', attendees: '300+' },
];

const CATEGORIES = ['All', 'In-Person', 'Virtual', 'Workshop', 'Networking'];

export function EventsV2() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEvents = EVENTS.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Community Events | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-3xl font-bold text-white mb-4">Upcoming Events</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Connect with experts and fellow applicants at our events.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white border border-slate-200 p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="text-center md:text-left min-w-[100px] pb-4 md:pb-0 md:pr-6 border-b md:border-b-0 md:border-r border-slate-200">
                  <div className="text-3xl font-bold text-blue-600">{event.date.split(' ')[1].replace(',', '')}</div>
                  <div className="text-sm font-bold text-slate-500 uppercase">{event.date.split(' ')[0]}</div>
                  <div className="text-xs text-slate-400">{event.date.split(',')[1]}</div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <Badge 
                    variant={
                      event.type === 'Virtual' ? 'primary' :
                      event.type === 'Workshop' ? 'warning' : 'success'
                    }
                    className="mb-2"
                  >
                    {event.type}
                  </Badge>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                    
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.attendees} attending
                    </span>
                  </div>
                </div>

                <Button variant="outline">
                  Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
