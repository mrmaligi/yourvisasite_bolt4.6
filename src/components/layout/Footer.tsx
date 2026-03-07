import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

export function Footer() {
  return (
    <footer className="relative bg-neutral-950 text-neutral-400 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="col-span-2 md:col-span-12 lg:col-span-4 pr-8">
            <Link to="/">
              <Logo variant="light" size="sm" />
            </Link>
            <p className="text-sm text-neutral-500 mt-6 leading-relaxed max-w-sm">
              Making Australian immigration transparent, affordable, and accessible for everyone. Your modern journey to residency starts here.
            </p>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-neutral-100 font-semibold text-sm mb-6 tracking-wide uppercase text-xs">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/tracker" className="text-neutral-500 hover:text-white transition-colors duration-200">Tracker</Link></li>
              <li><Link to="/visas" className="text-neutral-500 hover:text-white transition-colors duration-200">Visa Search</Link></li>
              <li><Link to="/quiz" className="text-neutral-500 hover:text-white transition-colors duration-200">Eligibility Quiz</Link></li>
              <li><Link to="/marketplace" className="text-neutral-500 hover:text-white transition-colors duration-200">Marketplace</Link></li>
              <li><Link to="/news" className="text-neutral-500 hover:text-white transition-colors duration-200">News</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-neutral-100 font-semibold text-sm mb-6 tracking-wide uppercase text-xs">Services</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/lawyers" className="text-neutral-500 hover:text-white transition-colors duration-200">Find a Lawyer</Link></li>
              <li><Link to="/visas" className="text-neutral-500 hover:text-white transition-colors duration-200">Premium Guides</Link></li>
              <li><Link to="/stories" className="text-neutral-500 hover:text-white transition-colors duration-200">Success Stories</Link></li>
              <li><Link to="/register/lawyer" className="text-neutral-500 hover:text-white transition-colors duration-200">For Lawyers</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-neutral-100 font-semibold text-sm mb-6 tracking-wide uppercase text-xs">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="text-neutral-500 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/careers" className="text-neutral-500 hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link to="/privacy" className="text-neutral-500 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-neutral-500 hover:text-white transition-colors duration-200">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-neutral-100 font-semibold text-sm mb-6 tracking-wide uppercase text-xs">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/faq" className="text-neutral-500 hover:text-white transition-colors duration-200">Help Center</Link></li>
              <li><Link to="/contact" className="text-neutral-500 hover:text-white transition-colors duration-200">Contact Us</Link></li>
              <li><a href="mailto:support@visabuild.com" className="text-neutral-500 hover:text-white transition-colors duration-200">support@visabuild.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} VisaBuild. All rights reserved.
          </p>
          <div className="flex gap-4 items-center">
            <p className="text-sm text-neutral-600 flex items-center gap-1">
              Made with <span className="text-red-500">❤️</span> for immigrants
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
