import { useState } from 'react';
import { MapPin, Briefcase, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const openPositions: JobListing[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Sydney / Remote',
    type: 'Full-time',
    description: 'Join our engineering team building the future of immigration technology. You will work on our React/Node.js platform serving thousands of users.',
    requirements: [
      '5+ years experience with React and TypeScript',
      'Strong backend skills (Node.js, PostgreSQL)',
      'Experience with cloud infrastructure (AWS/GCP)',
      'Passion for building user-focused products'
    ]
  },
  {
    id: '2',
    title: 'Content Writer - Immigration',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create clear, helpful content about Australian visas. Work with our legal team to make complex immigration information accessible.',
    requirements: [
      'Excellent writing and editing skills',
      'Ability to explain complex topics simply',
      'Interest in immigration/law topics',
      'SEO experience preferred'
    ]
  },
  {
    id: '3',
    title: 'Customer Success Manager',
    department: 'Operations',
    location: 'Sydney',
    type: 'Full-time',
    description: 'Help our users navigate the platform and connect with the right resources. Be the voice of the customer within our team.',
    requirements: [
      '3+ years in customer success or support',
      'Excellent communication skills',
      'Empathy and patience',
      'Experience with CRM tools'
    ]
  },
  {
    id: '4',
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'Sydney / Remote',
    type: 'Full-time',
    description: 'Drive user acquisition and engagement. Own our paid channels, SEO, referral program, and content marketing.',
    requirements: [
      '4+ years in growth marketing',
      'Experience with paid social and SEM',
      'Data-driven approach',
      'Previous startup experience preferred'
    ]
  }
];

const benefits = [
  'Competitive salary + equity',
  'Flexible work arrangements',
  'Health and wellness stipend',
  'Learning & development budget',
  'Generous paid time off',
  'Parental leave',
  'Team retreats',
  'Home office setup'
];

export function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Help millions of people navigate their immigration journey. 
            We're building a team that cares deeply about making a difference.
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Why Work at VisaBuild?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              We're solving a real problem that affects millions of people. 
              Join us in making immigration simpler and more accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardBody className="text-center p-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Meaningful Work
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Every feature you build helps someone achieve their dream of moving to Australia.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center p-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Work-Life Balance
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Flexible hours, remote-friendly, and unlimited PTO. We trust you to do great work.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center p-8">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Sydney + Remote
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Beautiful office in Sydney CBD, or work from anywhere. Your choice.
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Benefits */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white text-center mb-8">
              Benefits & Perks
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-neutral-700 dark:text-neutral-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-8">
              Open Positions
            </h2>
            <div className="space-y-4">
              {openPositions.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardBody className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedJob(job)}
                        className="flex items-center gap-2"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {selectedJob.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>{selectedJob.department}</span>
                    <span>•</span>
                    <span>{selectedJob.location}</span>
                    <span>•</span>
                    <span>{selectedJob.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  ✕
                </button>
              </div>

              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                {selectedJob.description}
              </p>

              <div className="mb-8">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">
                  Apply Now
                </Button>
                <Button variant="secondary" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
