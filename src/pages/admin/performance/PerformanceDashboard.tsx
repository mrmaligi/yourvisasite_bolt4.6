import { Link } from 'react-router-dom';
import { Card, CardBody } from '../../../components/ui/Card';
import {
  Activity,
  Settings,
  TestTube,
  Book,
  ArrowRight
} from 'lucide-react';

export function PerformanceDashboard() {
  const categories = [
    {
      title: 'Monitoring',
      description: 'Real-time metrics and system health monitoring.',
      icon: Activity,
      path: '/admin/performance/monitoring',
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      items: ['Real-time Traffic', 'Server Health', 'Error Logs', 'API Latency']
    },
    {
      title: 'Optimization',
      description: 'Tools to analyze and improve application performance.',
      icon: Settings,
      path: '/admin/performance/optimization',
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      items: ['Image Compressor', 'Database Analyzer', 'SEO Analyzer', 'Bundle Size']
    },
    {
      title: 'Testing',
      description: 'Run tests and view quality assurance reports.',
      icon: TestTube,
      path: '/admin/performance/testing',
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30',
      items: ['Unit Tests', 'E2E Status', 'Load Testing', 'API Tester']
    },
    {
      title: 'Documentation',
      description: 'Technical documentation and guides.',
      icon: Book,
      path: '/admin/performance/docs',
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      items: ['API Reference', 'Architecture', 'Deployment Guide', 'Security Policy']
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card key={category.title} className="hover:border-primary-500 transition-colors h-full">
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${category.bg}`}>
                  <Icon className={`w-8 h-8 ${category.color}`} />
                </div>
                <Link
                  to={category.path}
                  className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                {category.title}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                {category.description}
              </p>

              <div className="space-y-2">
                {category.items.map((item) => (
                  <div key={item} className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 mr-2" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  to={category.path}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                >
                  View All Tools
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
