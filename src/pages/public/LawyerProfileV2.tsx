import { Briefcase, MapPin, DollarSign, Star, User, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerProfileV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-600">J</span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">Jane Smith</h1>
              <p className="text-slate-400 mb-4">Senior Migration Lawyer at VisaBuild Legal</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-white">4.9</span>
                  <span className="text-slate-400">(128 reviews)</span>
                </div>
                
                <span className="px-3 py-1 bg-green-600 text-white text-sm">Available</span>
              </div>
            </div>
            
            <Button variant="primary">Book Consultation</Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6 text-center">
            <Briefcase className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-slate-600">Experience</p>
            <p className="text-2xl font-bold text-slate-900">10+ years</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-slate-600">Success Rate</p>
            <p className="text-2xl font-bold text-slate-900">95%</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 text-center">
            <User className="w-6 h-6 mx-auto mb-2 text-amber-600" />
            <p className="text-sm text-slate-600">Clients</p>
            <p className="text-2xl font-bold text-slate-900">500+</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">About</h2>
          <p className="text-slate-600">
            Jane Smith is a senior migration lawyer with over 10 years of experience 
            in Australian immigration law. She specializes in partner visas, skilled 
            migration, and complex cases. Jane has helped over 500 clients achieve 
            their Australian visa goals.
          </p>
        </div>
      </div>
    </div>
  );
}
