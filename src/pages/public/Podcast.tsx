import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mic, Play, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

const EPISODES = [
  { id: 1, title: 'Episode 42: The Future of SkillSelect', date: 'Oct 10', duration: '32 min', desc: 'We discuss the upcoming changes to the SkillSelect system.' },
  { id: 2, title: 'Episode 41: Interview with a Visa Officer', date: 'Oct 03', duration: '45 min', desc: 'An exclusive interview revealing what really happens behind the scenes.' },
  { id: 3, title: 'Episode 40: Common Mistakes to Avoid', date: 'Sep 26', duration: '28 min', desc: 'Top 5 errors applicants make and how to fix them.' },
  { id: 4, title: 'Episode 39: Regional Visas Explained', date: 'Sep 19', duration: '35 min', desc: 'Why regional Australia might be your best pathway to PR.' },
];

export function Podcast() {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>VisaBuild Podcast | Immigration Insights</title>
        <meta name="description" content="Listen to the VisaBuild podcast for the latest Australian immigration news and expert advice." />
      </Helmet>

      <section className="bg-neutral-100 dark:bg-neutral-800 py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-64 h-64 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-2xl flex items-center justify-center flex-shrink-0">
            <Mic className="w-24 h-24 text-white opacity-80" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">The VisaBuild Podcast</h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-6">
              Weekly conversations with migration experts, lawyers, and successful applicants.
              Your audio guide to Australian PR.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-primary-600">
                Subscribe
              </Button>
              <Button variant="secondary" size="lg">
                Latest Episode
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-neutral-900 dark:text-white">Recent Episodes</h2>
        <div className="space-y-4">
          {EPISODES.map((ep, index) => (
            <motion.div
              key={ep.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow dark:bg-neutral-800 dark:border-neutral-700">
                <CardBody className="p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      <span>{ep.date}</span>
                      <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {ep.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">{ep.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm">{ep.desc}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-primary-600">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
