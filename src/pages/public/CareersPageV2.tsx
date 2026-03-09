import { FileText, CheckCircle, Download, Star, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicCareersPageV2() {
  const benefits = [
    'Competitive salary',
    'Health insurance',
    'Flexible work hours',
    'Remote work options',
    'Professional development',
    'Team events',
  ];

  const jobs = [
    { title: 'Senior Migration Lawyer', location: 'Sydney', type: 'Full-time' },
    { title: 'Customer Support Specialist', location: 'Melbourne', type: 'Full-time' },
    { title: 'Frontend Developer', location: 'Remote', type: 'Full-time' },
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
            <p className="text-lg text-slate-700 mb-4">"Working at VisaBuild has been incredibly rewarding. We're making a real difference in people's lives." </p>
            <p className="text-slate-500">— Jane Smith, Senior Lawyer</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>
        
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{job.title}</h3>
                <p className="text-slate-500">{job.location} • {job.type}</p>
              </div>
              <Button variant="primary">Apply Now</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
