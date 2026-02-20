import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

const PRESS_RELEASES = [
  { id: 1, title: 'VisaBuild Raises Series A to Simplify Migration', date: 'Oct 01, 2024' },
  { id: 2, title: 'Partnering with Top Australian Law Firms', date: 'Sep 15, 2024' },
  { id: 3, title: 'VisaBuild Launches New AI Visa Assessment Tool', date: 'Aug 28, 2024' },
];

export function Press() {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Press & Media | VisaBuild</title>
        <meta name="description" content="Latest news, press releases, and media resources from VisaBuild." />
      </Helmet>

      <section className="bg-neutral-100 dark:bg-neutral-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">Newsroom</h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Latest updates, stories, and resources for media.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Press Releases</h2>
          <Button variant="ghost" className="text-primary-600">View Archive <ArrowRight className="ml-2 w-4 h-4" /></Button>
        </div>

        <div className="grid gap-6">
          {PRESS_RELEASES.map((item, index) => (
             <motion.div
               key={item.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
             >
                <Card className="hover:border-primary-500 transition-colors dark:bg-neutral-800 dark:border-neutral-700">
                  <CardBody className="p-6">
                    <p className="text-sm text-neutral-500 mb-2">{item.date}</p>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{item.title}</h3>
                  </CardBody>
                </Card>
             </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-neutral-900 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Media Kit</h2>
          <p className="text-neutral-400 max-w-xl mx-auto mb-8">
            Download our brand assets, including logos, screenshots, and executive headshots.
          </p>
          <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
            <Download className="mr-2 w-5 h-5" /> Download Assets
          </Button>
        </div>
      </section>
    </div>
  );
}
