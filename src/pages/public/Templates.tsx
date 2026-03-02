import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Download, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

const TEMPLATES = [
  { id: 1, title: 'Statutory Declaration Template', category: 'General', format: 'DOCX', link: '/resources/templates/statutory-declaration' },
  { id: 2, title: 'Employment Reference Letter Template', category: 'Work', format: 'DOCX', link: '/resources/templates/employment-reference' },
  { id: 3, title: 'Visa Resume/CV Template', category: 'Skilled', format: 'DOCX', link: '/resources/templates/resume' },
  { id: 4, title: 'Sponsorship Letter Template', category: 'Family', format: 'DOCX', link: '/resources/templates/sponsorship-letter' },
  { id: 5, title: 'Relationship Statement Template', category: 'Partner', format: 'DOCX', link: '/resources/templates/relationship-statement' },
];

export function Templates() {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Document Templates | VisaBuild</title>
        <meta name="description" content="Professional document templates for your visa application." />
      </Helmet>

      <section className="bg-neutral-900 py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-neutral-800 rounded-full border border-neutral-700">
              <FileText className="w-12 h-12 text-primary-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Document Templates</h1>
          <p className="text-neutral-300 max-w-2xl mx-auto">
            Save time and avoid errors with our lawyer-approved document templates.
            Ready to edit and submit.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700 flex flex-col">
                <CardBody className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                      <Star className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded uppercase">
                      {item.format}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 flex-grow">
                    Category: {item.category}
                  </p>
                  <Link to={item.link} className="w-full mt-auto">
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" /> Get Template
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
