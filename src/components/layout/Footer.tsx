import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/">
              <Logo variant="light" size="sm" />
            </Link>
            <p className="text-sm text-neutral-500 mt-4 leading-relaxed">
              Making Australian immigration transparent, affordable, and accessible for everyone.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/tracker" className="hover:text-white transition-colors duration-200">Tracker</Link></li>
              <li><Link to="/visas" className="hover:text-white transition-colors duration-200">Visa Search</Link></li>
              <li><Link to="/quiz" className="hover:text-white transition-colors duration-200">Eligibility Quiz</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition-colors duration-200">Marketplace</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors duration-200">News</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/lawyers" className="hover:text-white transition-colors duration-200">Find a Lawyer</Link></li>
              <li><Link to="/visas" className="hover:text-white transition-colors duration-200">Premium Guides</Link></li>
              <li><Link to="/stories" className="hover:text-white transition-colors duration-200">Success Stories</Link></li>
              <li><Link to="/register/lawyer" className="hover:text-white transition-colors duration-200">Become a Lawyer</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors duration-200">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors duration-200">Help Center / FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link></li>
              <li><a href="mailto:support@visabuild.com" className="hover:text-white transition-colors duration-200">support@visabuild.com</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} VisaBuild. All rights reserved.
          </p>
          <p className="text-xs text-neutral-600">
            Made with ❤️ for immigrants, by immigrants.
          </p>
        </div>
      </div>
    </footer>
  );
}
