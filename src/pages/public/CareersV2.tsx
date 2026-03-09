import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Briefcase, Clock, ChevronRight, CheckCircle, Heart, Globe, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const OPEN_POSITIONS: JobListing[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Sydney / Remote',
    type: 'Full-time',
    description: 'Join our engineering team building the future of immigration technology.',
  },
  {
    id: '2',
    title: 'Content Writer - Immigration',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create clear, helpful content about Australian visas.',
  },
  {
    id: '3',
    title: 'Customer Success Manager',
    department: 'Operations',
    location: 'Sydney',
    type: 'Full-time',
    description: 'Help our users navigate the platform and connect with resources.',
  },
];

const BENEFITS = [
  { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive health coverage' },
  { icon: Globe, title: 'Remote Friendly', description: 'Work from anywhere' },
  { icon: Users, title: 'Great Team', description: 'Collaborative environment' },
];

export function CareersV2() {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  return (
    <>
      <Helmet>
        <title>Careers | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Join Our Team</h1>
            <p className="text-lg text-slate-600">Help us make immigration simpler for everyone</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="bg-white border border-slate-200 p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>

          <div className="space-y-4">
            {OPEN_POSITIONS.map((job) => (
              <div key={job.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{job.title}</h3>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600">
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
                    
                    <p className="mt-3 text-slate-600">{job.description}</p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Apply
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 p-6 text-center">
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">Don't see the right role?</h3>
            <p className="text-blue-700 mb-4">We're always looking for talented people</p>
            <Button variant="outline">Send General Application</Button>
          </div>
        </div>
      </div>
    </>
  );
}
