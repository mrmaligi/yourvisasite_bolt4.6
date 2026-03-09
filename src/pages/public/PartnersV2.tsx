import { Users, Briefcase, MapPin, Mail, Globe } from 'lucide-react';

export function PublicPartnersV2() {
  const partners = [
    { name: 'Immigration Lawyers Association', type: 'Professional Body', location: 'Australia' },
    { name: 'Study Australia', type: 'Education', location: 'Global' },
    { name: 'Tech Migration Hub', type: 'Technology', location: 'Australia' },
    { name: 'Global Visa Solutions', type: 'Service Provider', location: 'International' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Our Partners</h1>
          <p className="text-xl text-slate-300">Working together to make immigration easier</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {partners.map((partner) => (
            <div key={partner.name} className="bg-white border border-slate-200 p-6">
              <div className="w-16 h-16 bg-slate-100 mb-4" />
              <h3 className="font-semibold text-slate-900">{partner.name}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {partner.type}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {partner.location}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 p-8 text-center">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Become a Partner</h2>
          <p className="text-blue-700 mb-4">Interested in partnering with VisaBuild? We'd love to hear from you.</p>
          <a href="mailto:partners@visabuild.com" className="inline-block px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
