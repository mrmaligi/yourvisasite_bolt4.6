import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Book, FileText, HelpCircle, ChevronRight, MessageCircle } from 'lucide-react';
import { UserDashboardLayout } from '@/components/layout/UserDashboardLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  { id: '1', title: 'Getting Started', icon: Book, count: 12 },
  { id: '2', title: 'Visa Applications', icon: FileText, count: 45 },
  { id: '3', title: 'Account & Billing', icon: HelpCircle, count: 8 },
  { id: '4', title: 'Community Guidelines', icon: MessageCircle, count: 5 },
];

const TOP_ARTICLES = [
  { id: '1', title: 'How to track your visa application status', category: 'Visa Applications' },
  { id: '2', title: 'Understanding point requirements for skilled visas', category: 'Visa Applications' },
  { id: '3', title: 'Resetting your password', category: 'Account & Billing' },
  { id: '4', title: 'Uploading documents securely', category: 'Getting Started' },
];

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <UserDashboardLayout>
      <Helmet>
        <title>Help Center | VisaBuild</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header & Search */}
        <div className="text-center max-w-2xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How can we help you?</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Search for answers..."
              className="pl-12 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Browse by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ y: -2 }}
                  className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-left hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
                >
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{cat.title}</h3>
                  <p className="text-sm text-neutral-500 mt-1">{cat.count} articles</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Top Articles */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Top Articles</h2>
            <div className="space-y-2">
              {TOP_ARTICLES.map((article) => (
                <a
                  key={article.id}
                  href="#"
                  className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg group transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-0.5">{article.category}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                </a>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Contact Support */}
        <div className="bg-primary-600 dark:bg-primary-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="text-primary-100 mb-6 max-w-md mx-auto">
            Our support team is available Monday to Friday to assist you with any questions.
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-neutral-100 border-none">
            Contact Support
          </Button>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
