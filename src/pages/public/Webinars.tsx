import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Video, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

const WEBINARS = [
  { id: 1, title: 'Skilled Migration Updates Webinar', speaker: 'John Doe, Immigration Lawyer', date: 'Oct 15, 2024', duration: '45 min', link: '/resources/webinars/skilled-migration' },
  { id: 2, title: 'Partner Visa Masterclass', speaker: 'Jane Smith, Senior Agent', date: 'Sep 28, 2024', duration: '60 min', link: '/resources/webinars/partner-visa' },
  { id: 3, title: 'Student to PR Pathways', speaker: 'Mike Brown, Migration Expert', date: 'Sep 10, 2024', duration: '50 min', link: '/resources/webinars/student-pathways' },
  { id: 4, title: 'Business Innovation and Investment', speaker: 'Alice Green, Business Specialist', date: 'Aug 22, 2024', duration: '55 min', link: '/resources/webinars/business-visa' },
  { id: 5, title: 'Road to Citizenship', speaker: 'Tom White, Legal Advisor', date: 'Aug 05, 2024', duration: '40 min', link: '/resources/webinars/citizenship' },
];

export function Webinars() {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Immigration Webinars | VisaBuild</title>
        <meta name="description" content="Watch expert webinars on Australian immigration topics." />
      </Helmet>

      <section className="bg-neutral-900 py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="text-primary-400 font-bold tracking-wide uppercase text-sm mb-2 block">Featured Session</span>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">Mastering the Skilled Migration Points Test</h1>
              <p className="text-neutral-300 text-lg mb-8 max-w-xl">
                Join our expert panel as they break down every component of the points test and share strategies to maximize your score.
              </p>
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                <Play className="w-5 h-5 mr-2" /> Watch Now
              </Button>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-video bg-neutral-800 rounded-2xl border border-neutral-700 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-neutral-900 dark:text-white">Recent Sessions</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {WEBINARS.map((webinar, index) => (
            <motion.div
              key={webinar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={webinar.link}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700 group cursor-pointer">
                  <CardBody className="p-0">
                    <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 relative">
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
                       </div>
                       <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                         {webinar.duration}
                       </div>
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-primary-600 dark:text-primary-400 mb-2 font-medium">{webinar.date}</div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {webinar.title}
                      </h3>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        with {webinar.speaker}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
