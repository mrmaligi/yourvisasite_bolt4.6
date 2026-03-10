import { Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';

export function ContactInfoV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-400">Get in touch with our team</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
            <p className="text-slate-600">+61 2 1234 5678</p>
            <p className="text-sm text-slate-500">Mon-Fri, 9am-5pm AEST</p>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="w-12 h-12 bg-green-100 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
            <p className="text-slate-600">support@visabuild.com</p>
            <p className="text-sm text-slate-500">24/7 response within 24h</p>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="w-12 h-12 bg-amber-100 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Office</h3>
            <p className="text-slate-600">123 Martin Place</p>
            <p className="text-slate-600">Sydney NSW 2000</p>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Hours</h3>
            <p className="text-slate-600">Monday - Friday</p>
            <p className="text-slate-600">9:00 AM - 5:00 PM AEST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
