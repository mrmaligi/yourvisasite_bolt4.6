import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckSquare, Download, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

const CHECKLISTS = [
  { id: 1, title: 'Partner Visa (820/801) Evidence Checklist', category: 'Family', pages: 4 },
  { id: 2, title: 'Employer Nomination Document List', category: 'Work', pages: 3 },
  { id: 3, title: 'Student Visa Financial Capacity', category: 'Student', pages: 2 },
  { id: 4, title: 'General Skilled Migration Points Test', category: 'Skilled', pages: 5 },
  { id: 5, title: 'Citizenship Ceremony Preparation', category: 'Citizenship', pages: 1 },
];

export function Checklists() {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Document Checklists | VisaBuild</title>
        <meta name="description" content="Download free document checklists for Australian visa applications." />
      </Helmet>

      <section className="bg-primary-50 dark:bg-primary-900/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-full shadow-sm">
              <CheckSquare className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Document Checklists</h1>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Ensure your application is decision-ready with our comprehensive document checklists.
            Missing documents are the #1 cause of visa delays.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CHECKLISTS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700 flex flex-col">
                <CardBody className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                      {item.pages} Pages
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 flex-grow">
                    Category: {item.category}
                  </p>
                  <div className="flex gap-3 mt-auto">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" /> PDF
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
