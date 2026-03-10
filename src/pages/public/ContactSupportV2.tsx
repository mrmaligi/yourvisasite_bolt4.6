import { Headphones, MessageSquare, Mail, Phone, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ContactSupportV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Contact Support</h1>
          <p className="text-slate-400">We're here to help. Choose how you'd like to reach us.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Live Chat</h3>
            <p className="text-sm text-slate-500 mb-4">Chat with our support team in real-time</p>
            <Button variant="primary" className="w-full">Start Chat</Button>
          </div>

          <div className="bg-white border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
            <p className="text-sm text-slate-500 mb-4">Get a response within 24 hours</p>
            <Button variant="outline" className="w-full">Send Email</Button>
          </div>

          <div className="bg-white border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 mx-auto mb-4 flex items-center justify-center">
              <Phone className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
            <p className="text-sm text-slate-500 mb-4">Call us during business hours</p>
            <Button variant="outline" className="w-full">+61 2 1234 5678</Button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Send us a Message</h2>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-slate-200" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <select className="w-full px-3 py-2 border border-slate-200">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Billing Question</option>
                <option>Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea className="w-full px-3 py-2 border border-slate-200 h-32" />
            </div>

            <Button variant="primary">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
