import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  Map,
  Shield,
  User,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function Welcome() {
  const { profile } = useAuth();

  const steps = [
    { id: 1, title: 'Create Account', completed: true, icon: User },
    { id: 2, title: 'Verify Email', completed: true, icon: Shield }, // Assuming verified since they are logged in
    { id: 3, title: 'Complete Profile', completed: !!profile?.full_name, icon: FileText },
    { id: 4, title: 'Start Application', completed: false, icon: Map },
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Helmet>
        <title>Welcome | VisaBuild</title>
      </Helmet>

      <div className="text-center space-y-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
            Welcome to VisaBuild{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mt-4">
            We're here to guide you through every step of your visa journey. Let's get you set up for success.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Getting Started</h2>
              <p className="text-sm text-neutral-500">Complete these steps to unlock full access</p>
            </CardHeader>
            <CardBody>
              <div className="mb-8">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-neutral-900 dark:text-white">{progress}% Complete</span>
                  <span className="text-neutral-500">{completedSteps}/{steps.length} Steps</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="bg-primary-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      className={`flex items-center p-4 rounded-xl border ${
                        step.completed
                          ? 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30'
                          : 'bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        step.completed
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'
                      }`}>
                        {step.completed ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${step.completed ? 'text-green-900 dark:text-green-100' : 'text-neutral-900 dark:text-white'}`}>
                          {step.title}
                        </h3>
                      </div>
                      {!step.completed && (
                        <Button size="sm" variant="secondary" onClick={() => window.location.href = step.id === 3 ? '/dashboard/profile' : '/dashboard/getting-started'}>
                          Start
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions / Tour */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none">
            <CardBody className="p-8 flex flex-col items-center text-center">
              <Map className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2">Take the Tour</h3>
              <p className="text-primary-100 mb-6 text-sm">
                Discover all the features available to help you secure your visa.
              </p>
              <Link to="/dashboard/tour" className="w-full">
                <Button className="w-full bg-white text-primary-700 hover:bg-primary-50 border-none">
                  Start Tour
                </Button>
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Link to="/visas" className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
                  <span className="text-sm text-neutral-600 dark:text-neutral-300 group-hover:text-primary-600">Find a Visa</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
                </Link>
                <Link to="/dashboard/roadmap" className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
                  <span className="text-sm text-neutral-600 dark:text-neutral-300 group-hover:text-primary-600">View Roadmap</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
                </Link>
                <Link to="/contact" className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
                  <span className="text-sm text-neutral-600 dark:text-neutral-300 group-hover:text-primary-600">Contact Support</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
