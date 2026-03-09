import { Briefcase, MapPin, DollarSign, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CareersPageV2() {
  const jobs = [
    { title: 'Senior Migration Lawyer', location: 'Sydney', type: 'Full-time', salary: '$120k - $150k' },
    { title: 'Visa Consultant', location: 'Melbourne', type: 'Full-time', salary: '$80k - $100k' },
    { title: 'Customer Support Specialist', location: 'Remote', type: 'Full-time', salary: '$60k - $75k' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Careers</h1>
          <p className="text-slate-400">Join our team and help people achieve their visa goals</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Open Positions</h2>
        
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">{job.title}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary}</span>
                  </div>
                </div>
                
                <Button variant="outline">Apply</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
