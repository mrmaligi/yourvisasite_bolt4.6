import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Send
} from 'lucide-react';
import { ModernButton } from '../components/ui/ModernButton';
import { ModernCard, ContentContainer, PageHeader } from '../components/layout/ModernLayout';

export function ContactModern() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-24">
        <ContentContainer>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Message Sent!</h2>
            <p className="text-slate-600 mb-8">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <Link to="/">
              <ModernButton>
                Return Home
                <ArrowRight className="ml-2 w-5 h-5" />
              </ModernButton>
            </Link>
          </motion.div>
        </ContentContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <PageHeader
        title="Contact Us"
        subtitle="Have questions? We're here to help with your visa journey"
      />

      <ContentContainer>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ModernCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="visa">Visa Question</option>
                    <option value="premium">Premium Support</option>
                    <option value="lawyer">Lawyer Partnership</option>
                    <option value="technical">Technical Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <ModernButton
                  type="submit"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5" />
                </ModernButton>
              </form>
            </ModernCard>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Other ways to reach us</h3>
              <p className="text-slate-600">
                Our team is available Monday through Friday, 9 AM to 6 PM AEDT.
              </p>
            </div>

            <div className="space-y-4">
              <ModernCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Email</h4>
                    <p className="text-slate-600">support@visabuild.com</p>
                    <p className="text-sm text-slate-500">For general inquiries</p>
                  </div>
                </div>
              </ModernCard>

              <ModernCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Phone</h4>
                    <p className="text-slate-600">1800 123 456</p>
                    <p className="text-sm text-slate-500">Australia toll-free</p>
                  </div>
                </div>
              </ModernCard>

              <ModernCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Office</h4>
                    <p className="text-slate-600">Melbourne, Australia</p>
                    <p className="text-sm text-slate-500">By appointment only</p>
                  </div>
                </div>
              </ModernCard>
            </div>
          </motion.div>
        </div>
      </ContentContainer>
    </div>
  );
}

export default ContactModern;
