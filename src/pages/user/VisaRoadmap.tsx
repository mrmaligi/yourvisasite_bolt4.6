import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, FileText, Gavel, Plane } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';

const stages = [
  { id: 1, title: 'Initial Assessment', desc: 'Determine your eligibility and best visa options.', icon: MapPin, status: 'completed' },
  { id: 2, title: 'Gather Documents', desc: 'Collect all necessary identification and evidence.', icon: FileText, status: 'current' },
  { id: 3, title: 'Lodge Application', desc: 'Submit your application to the Department.', icon: Plane, status: 'upcoming' },
  { id: 4, title: 'Health & Character', desc: 'Complete medical exams and police checks.', icon: CheckCircle, status: 'upcoming' },
  { id: 5, title: 'Decision', desc: 'Receive the outcome of your application.', icon: Gavel, status: 'upcoming' },
];

export function VisaRoadmap() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Visa Roadmap | VisaBuild</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Visa Application Roadmap</h1>
        <p className="text-neutral-500 mt-1">Your journey from start to finish.</p>
      </div>

      <div className="relative border-l-2 border-neutral-200 dark:border-neutral-700 ml-6 space-y-12 py-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative pl-12"
            >
              {/* Dot on line */}
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${
                isCompleted ? 'bg-green-500 border-green-500' :
                isCurrent ? 'bg-white border-primary-600 ring-4 ring-primary-100' :
                'bg-white border-neutral-300'
              }`} />

              <Card className={`${isCurrent ? 'border-primary-200 shadow-md' : ''}`}>
                <CardBody className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    isCompleted ? 'bg-green-100 text-green-600' :
                    isCurrent ? 'bg-primary-100 text-primary-600' :
                    'bg-neutral-100 text-neutral-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      isCompleted ? 'text-green-700' :
                      isCurrent ? 'text-primary-700' :
                      'text-neutral-900 dark:text-white'
                    }`}>
                      {stage.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                      {stage.desc}
                    </p>
                    {isCurrent && (
                      <div className="mt-3 inline-flex items-center text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        Current Stage
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
