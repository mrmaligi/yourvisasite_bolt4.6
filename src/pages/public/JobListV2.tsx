import { Briefcase, MapPin, DollarSign, Star, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function JobListV2() {
  const jobs = [
    { id: 1, title: 'Senior Migration Lawyer', location: 'Sydney', type: 'Full-time', salary: '$120k - $150k', featured: true },
    { id: 2, title: 'Visa Consultant', location: 'Melbourne', type: 'Full-time', salary: '$80k - $100k', featured: false },
    { id: 3, title: 'Customer Support Specialist', location: 'Remote', type: 'Full-time', salary: '$60k - $75k', featured: false },
    { id: 4, title: 'Legal Assistant', location: 'Brisbane', type: 'Part-time', salary: '$50k - $60k', featured: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-slate-400">Help people achieve their Australian visa dreams</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                    {job.featured && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs">Featured</span>
                    )}
                  </div>
                  
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
