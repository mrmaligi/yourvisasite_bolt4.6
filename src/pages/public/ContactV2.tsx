import { MessageSquare, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicContactV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-slate-300">We're here to help with your visa questions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
            <p className="text-slate-600 mb-2">+61 2 1234 5678</p>
            <p className="text-sm text-slate-500">Mon-Fri 9am-5pm AEDT</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
            <p className="text-slate-600 mb-2">support@visabuild.com</p>
            <p className="text-sm text-slate-500">24/7 support</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Live Chat</h3>
            <p className="text-slate-600 mb-2">Available now</p>
            <Button variant="primary" size="sm">Start Chat</Button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-200" />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-slate-200" />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea className="w-full px-3 py-2 border border-slate-200 h-32" />
          </div>
          
          <Button variant="primary" className="w-full md:w-auto">Send Message</Button>
        </div>
      </div>
    </div>
  );
}
