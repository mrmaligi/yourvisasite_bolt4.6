import { Building, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicAboutV2() {
  const stats = [
    { label: 'Users Helped', value: '50,000+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Expert Lawyers', value: '200+' },
    { label: 'Countries', value: '120+' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">About VisaBuild</h1>
          <p className="text-xl text-slate-300">Making immigration simpler for everyone</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-6 text-center">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-700 mb-4">We believe everyone deserves access to quality immigration assistance. Our platform connects you with experienced migration lawyers and provides the tools you need for a successful visa application.</p>
            
            <p className="text-slate-700">Founded in 2020, VisaBuild has helped thousands of people achieve their dream of living and working in Australia.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">123 George Street, Sydney NSW 2000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">hello@visabuild.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">+61 2 1234 5678</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
