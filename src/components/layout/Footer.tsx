import { Link } from 'react-router-dom';
import { Shield, FileCheck, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { Logo } from '../ui/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-navy-200">
      {/* Trust Bar */}
      <div className="bg-navy-800 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold-500" />
              <span>Government Verified Information</span>
            </div>
            <div className="w-px h-4 bg-navy-600 hidden sm:block" />
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-gold-500" />
              <span>Accurate & Up-to-Date</span>
            </div>
            <div className="w-px h-4 bg-navy-600 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gold-500" />
              <span>Serving 150+ Countries</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/">
              <Logo variant="light" size="sm" />
            </Link>
            <p className="text-sm text-navy-300 mt-4 leading-relaxed">
              Your trusted partner in Australian immigration. Accurate visa information, verified processing times, and expert guidance.
            </p>
            <div className="mt-4 space-y-2">
              <a href="tel:+611300123456" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-400 transition-colors">
                <Phone className="w-4 h-4" />
                1300 123 456
              </a>
              <a href="mailto:support@visabuild.com" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-400 transition-colors">
                <Mail className="w-4 h-4" />
                support@visabuild.com
              </a>
            </div>
          </div>

          {/* Visa Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Visa Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/visas" className="text-navy-300 hover:text-white transition-colors">Visa Search</Link></li>
              <li><Link to="/tracker" className="text-navy-300 hover:text-white transition-colors">Processing Tracker</Link></li>
              <li><Link to="/quiz" className="text-navy-300 hover:text-white transition-colors">Eligibility Quiz</Link></li>
              <li><Link to="/guides" className="text-navy-300 hover:text-white transition-colors">Premium Guides</Link></li>
              <li><Link to="/marketplace" className="text-navy-300 hover:text-white transition-colors">Document Services</Link></li>
            </ul>
          </div>

          {/* Legal Support */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/lawyers" className="text-navy-300 hover:text-white transition-colors">Find a Lawyer</Link></li>
              <li><Link to="/lawyers?filter=available" className="text-navy-300 hover:text-white transition-colors">Book Consultation</Link></li>
              <li><Link to="/stories" className="text-navy-300 hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link to="/register/lawyer" className="text-navy-300 hover:text-white transition-colors">Join as Lawyer</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/news" className="text-navy-300 hover:text-white transition-colors">Immigration News</Link></li>
              <li><Link to="/forum" className="text-navy-300 hover:text-white transition-colors">Community Forum</Link></li>
              <li><Link to="/faq" className="text-navy-300 hover:text-white transition-colors">FAQ & Help</Link></li>
              <li><Link to="/about" className="text-navy-300 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="text-navy-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-navy-300 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-navy-300 hover:text-white transition-colors">Legal Disclaimer</Link></li>
              <li><Link to="/contact" className="text-navy-300 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-navy-400">
              <p>© {currentYear} UVS VisaBuild. All rights reserved.</p>
              <p className="mt-1">ABN: 12 345 678 901 | Not affiliated with the Australian Government</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-navy-400 hover:text-white text-sm transition-colors">Sitemap</a>
              <span className="text-navy-600">|</span>
              <a href="#" className="text-navy-400 hover:text-white text-sm transition-colors">Accessibility</a>
            </div>
          </div>
          <p className="text-xs text-navy-500 mt-4 text-center md:text-left">
            This website provides general information only and does not constitute legal advice. Always consult with a registered migration agent or lawyer for your specific situation.
          </p>
        </div>
      </div>
    </footer>
  );
}
