import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BookOpen, FileText, CheckSquare, Video, Mic, Calendar, Users, Newspaper, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@/components/ui/Card';

export function Resources() {
  const categories = [
    { name: 'Guides', icon: BookOpen, path: '/resources/guides', description: 'Comprehensive immigration guides' },
    { name: 'Checklists', icon: CheckSquare, path: '/resources/checklists', description: 'Downloadable document checklists' },
    { name: 'Templates', icon: FileText, path: '/resources/templates', description: 'Professional document templates' },
    { name: 'Webinars', icon: Video, path: '/resources/webinars', description: 'Expert video sessions' },
    { name: 'Podcast', icon: Mic, path: '/resources/podcast', description: 'Immigration insights on the go' },
    { name: 'Events', icon: Calendar, path: '/resources/events', description: 'Community meetups and workshops' },
    { name: 'Partners', icon: Users, path: '/partners', description: 'Trusted migration partners' },
    { name: 'Press', icon: Newspaper, path: '/press', description: 'Media resources and news' },
    { name: 'API Docs', icon: Code, path: '/api-docs', description: 'Developer documentation' },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Immigration Resources | VisaBuild</title>
        <meta name="description" content="Access our comprehensive library of immigration resources including guides, checklists, templates, and webinars." />
      </Helmet>

      <section className="relative overflow-hidden bg-neutral-900 py-24 sm:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-neutral-800" />
          <div className="h-full w-full bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Resource Hub</h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Everything you need to navigate your migration journey, all in one place.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link key={index} to={category.path}>
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
                  <CardBody className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <category.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{category.name}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400">{category.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
