import { Briefcase, MapPin, DollarSign, Star, Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function JobDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Careers</span>
            <span>/</span>
            <span className="text-white">Senior Migration Lawyer</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Senior Migration Lawyer</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm">Full-time</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm">$120k - $150k</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm">Sydney</span>
        </div>

        <div className="bg-white border border-slate-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">About the Role</h2>
          <p className="text-slate-600 mb-6">
            We are looking for an experienced Migration Lawyer to join our growing team. 
            You will be responsible for managing a portfolio of visa applications and providing 
            expert advice to clients.
          </p>

          <h3 className="font-semibold text-slate-900 mb-3">Key Responsibilities</h3>
          <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
            <li>Manage partner visa applications from start to finish</li>
            <li>Provide expert migration advice to clients</li>
            <li>Liaise with Department of Home Affairs</li>
            <li>Mentor junior team members</li>
          </ul>

          <h3 className="font-semibold text-slate-900 mb-3">Requirements</h3>
          <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
            <li>5+ years experience in migration law</li>
            <li>Current practicing certificate</li>
            <li>Excellent communication skills</li>
            <li>Experience with partner visas preferred</li>
          </ul>

          <Button variant="primary" size="lg">Apply Now</Button>
        </div>
      </div>
    </div>
  );
}
