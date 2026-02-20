import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function GettingStarted() {
  const [completed, setCompleted] = useState<number[]>([1]); // Mock first item completed

  const checklist = [
    { id: 1, title: 'Verify your email address', desc: 'Secure your account access.' },
    { id: 2, title: 'Complete your profile', desc: 'Add personal details for accurate assessments.', link: '/dashboard/profile' },
    { id: 3, title: 'Take the eligibility quiz', desc: 'Find out which visas you qualify for.', link: '/quiz' },
    { id: 4, title: 'Browse visa options', desc: 'Explore detailed guides for your visa type.', link: '/visas' },
    { id: 5, title: 'Upload initial documents', desc: 'Store your passport and ID securely.', link: '/dashboard/documents' },
  ];

  const toggleComplete = (id: number) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Getting Started | VisaBuild</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Getting Started</h1>
        <p className="text-neutral-500 mt-1">Your roadmap to successfully using VisaBuild.</p>
      </div>

      <Card>
        <CardBody className="p-0">
          {checklist.map((item, index) => {
            const isCompleted = completed.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center p-6 border-b last:border-0 border-neutral-100 dark:border-neutral-700 transition-colors ${
                  isCompleted ? 'bg-neutral-50/50 dark:bg-neutral-800/30' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <button
                  onClick={() => toggleComplete(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-neutral-300 text-transparent hover:border-green-500'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1">
                  <h3 className={`font-medium ${isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-900 dark:text-white'}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500">{item.desc}</p>
                </div>

                {item.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = item.link!}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Go <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </motion.div>
            );
          })}
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <p className="text-sm text-neutral-500">
          {completed.length} of {checklist.length} completed
        </p>
      </div>
    </div>
  );
}
