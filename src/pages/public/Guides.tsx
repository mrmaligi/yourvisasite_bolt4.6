import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface Guide {
  id: number;
  title: string;
  category: string;
  readTime: string;
  description: string;
  link: string;
}

const GUIDES: Guide[] = [
  { id: 1, title: 'Skilled Independent Visa (189) Guide', category: 'Skilled', readTime: '15 min', description: 'Complete walkthrough for points-tested skilled migration.', link: '/resources/guides/skilled-independent' },
  { id: 2, title: 'Partner Visa (820/801) Application Steps', category: 'Family', readTime: '20 min', description: 'How to prove your relationship and apply for a partner visa.', link: '/resources/guides/partner-visa' },
  { id: 3, title: 'Student Visa (500) Requirements', category: 'Student', readTime: '10 min', description: 'Everything international students need to know before applying.', link: '/resources/guides/student-visa' },
  { id: 4, title: 'Employer Nomination Scheme (186)', category: 'Employer Sponsored', readTime: '18 min', description: 'Permanent residence for skilled workers nominated by employers.', link: '/resources/guides/employer-nomination' },
  { id: 5, title: 'Citizenship Application Process', category: 'Citizenship', readTime: '12 min', description: 'From permanent resident to Australian citizen.', link: '/resources/guides/citizenship' },
  { id: 6, title: 'Bridging Visas Explained', category: 'General', readTime: '8 min', description: 'Understanding your status between visas.', link: '#' },
];

export function Guides() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuides = GUIDES.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Immigration Guides | VisaBuild</title>
        <meta name="description" content="Step-by-step guides for Australian visas." />
      </Helmet>

      <section className="bg-neutral-50 dark:bg-neutral-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">Immigration Guides</h1>
          <p className="text-neutral-600 dark:text-neutral-300 mb-8">Expert-written guides to help you understand the visa process.</p>
          <div className="relative max-w-xl mx-auto">
            <div className="absolute left-3 top-3 z-10 text-neutral-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              className="pl-10 bg-white dark:bg-neutral-900"
              placeholder="Search guides (e.g., 'Student', '189')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={guide.link} className="block h-full">
                <Card className="h-full hover:border-primary-500 hover:shadow-md transition-all cursor-pointer dark:bg-neutral-800 dark:border-neutral-700">
                  <CardBody className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                        {guide.category}
                      </span>
                      <span className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                        <Clock className="w-3 h-3 mr-1" /> {guide.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{guide.title}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
                      {guide.description}
                    </p>
                    <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium">
                      Read Guide <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
          {filteredGuides.length === 0 && (
            <div className="col-span-full text-center py-12 text-neutral-500">
              No guides found matching your search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
