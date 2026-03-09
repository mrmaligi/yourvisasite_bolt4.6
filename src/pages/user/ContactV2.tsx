import { Phone, Mail, MapPin, Clock, MessageSquare, Video } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserContactV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Contact Us</h1>
          <p className="text-slate-600">Get in touch with our team</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-semibold text-slate-900">Phone</p>
            <p className="text-slate-600">+61 2 1234 5678</p>
            <p className="text-sm text-slate-500">Mon-Fri 9am-5pm AEDT</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-slate-900">Email</p>
            <p className="text-slate-600">support@visabuild.com</p>
            <p className="text-sm text-slate-500">24/7 response within 24h</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-amber-600" />
            </div>
            <p className="font-semibold text-slate-900">Office</p>
            <p className="text-slate-600">123 George Street</p>
            <p className="text-sm text-slate-500">Sydney NSW 2000</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-6">Send us a message</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 h-32" />
              </div>
              <Button variant="primary" className="w-full">Send Message</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Live Chat</h3>
              </div>
              <p className="text-blue-700 mb-4">Chat with our support team in real-time</p>
              <Button variant="outline">Start Chat</Button>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-slate-900">Book a Call</h3>
              </div>
              <p className="text-slate-600 mb-4">Schedule a video consultation with our experts</p>
              <Button variant="outline">Book Now</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
