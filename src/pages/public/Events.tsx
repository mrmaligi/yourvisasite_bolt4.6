import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

const EVENTS = [
  { id: 1, title: 'Sydney Migration Expo 2024', date: 'Nov 12, 2024', location: 'ICC Sydney', type: 'In-Person', attendees: '2000+' },
  { id: 2, title: 'Virtual Open Day: Student Visas', date: 'Oct 25, 2024', location: 'Online', type: 'Virtual', attendees: '500+' },
  { id: 3, title: 'Melbourne Meetup: Skilled Migrants', date: 'Oct 18, 2024', location: 'Federation Square', type: 'In-Person', attendees: '150+' },
  { id: 4, title: 'Brisbane Partner Visa Workshop', date: 'Oct 30, 2024', location: 'Brisbane Convention Centre', type: 'Workshop', attendees: '80+' },
];

export function Events() {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Community Events | VisaBuild</title>
        <meta name="description" content="Join our upcoming immigration events, workshops, and meetups." />
      </Helmet>

      <section className="bg-primary-600 py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Calendar className="w-16 h-16 mx-auto mb-6 text-primary-200" />
          <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Connect with experts and fellow applicants at our events.
            From large expos to intimate workshops, find the right event for you.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-6">
          {EVENTS.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
                <CardBody className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 text-center md:text-left min-w-[100px] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-700 pb-4 md:pb-0 md:pr-6">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{event.date.split(',')[0].split(' ')[1]}</div>
                    <div className="text-sm font-bold text-neutral-500 uppercase">{event.date.split(',')[0].split(' ')[0]}</div>
                    <div className="text-xs text-neutral-400 mt-1">{event.date.split(',')[1]}</div>
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                       <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                         event.type === 'Virtual' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                         event.type === 'Workshop' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                         'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                       }`}>
                         {event.type}
                       </span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{event.title}</h3>
                    <div className="flex flex-col md:flex-row gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center justify-center md:justify-start"><MapPin className="w-4 h-4 mr-1" /> {event.location}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="flex items-center justify-center md:justify-start"><Users className="w-4 h-4 mr-1" /> {event.attendees} Registered</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full md:w-auto">
                    <Button className="w-full md:w-auto">
                      Register Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
