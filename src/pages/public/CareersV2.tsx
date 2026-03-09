import { Briefcase, MapPin, DollarSign, Clock, CheckCircle, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicCareersV2() {
  const jobs = [
    { id: 1, title: 'Senior Migration Lawyer', department: 'Legal', location: 'Sydney', type: 'Full-time', salary: '$120k - $150k' },
    { id: 2, title: 'Customer Support Specialist', department: 'Support', location: 'Melbourne', type: 'Full-time', salary: '$70k - $85k' },
    { id: 3, title: 'Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', salary: '$100k - $130k' },
    { id: 4, title: 'Content Writer', department: 'Marketing', location: 'Sydney', type: 'Part-time', salary: '$60k - $75k' },
  ];

  const benefits = [
    'Competitive salary',
    'Flexible working hours',
    'Health insurance',
    'Professional development',
    'Work from home options',
    'Team events',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-xl text-slate-300">Help us make immigration easier for everyone</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Work With Us?</h2>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6">
            <Star className="w-8 h-8 text-blue-600 mb-4" />
            <p className="text-lg text-slate-700 mb-4">"VisaBuild has given me the opportunity to make a real difference in people's lives while growing my career." </p>
            <p className="text-slate-500">— Jane Smith, Senior Lawyer</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>
        
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{job.title}</h3>
                  <p className="text-blue-600 mb-2">{job.department}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.type}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary}</span>
                  </div>
                </div>
                <Button variant="primary">Apply Now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
