import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  LogOut, 
  Shield,
  ChevronDown,
  Briefcase,
  GraduationCap,
  Heart,
  Globe
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { useAuth } from '../contexts/AuthContext';

const visaCategories = [
  { name: 'Partner Visas', icon: Heart, path: '/visas?category=partner' },
  { name: 'Skilled Visas', icon: Briefcase, path: '/visas?category=skilled' },
  { name: 'Student Visas', icon: GraduationCap, path: '/visas?category=student' },
  { name: 'Visitor Visas', icon: Globe, path: '/visas?category=visitor' },
];

export function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showVisaMenu, setShowVisaMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
              VisaBuild
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="relative">
              <button
                onMouseEnter={() => setShowVisaMenu(true)}
                onMouseLeave={() => setShowVisaMenu(false)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/visas') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Find Visas
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showVisaMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setShowVisaMenu(true)}
                    onMouseLeave={() => setShowVisaMenu(false)}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                  >
                    {visaCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={cat.path}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <cat.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-slate-700">{cat.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/lawyers"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/lawyers') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Find Lawyers
            </Link>

            <Link
              to="/premium"
              className="px-4 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <Badge className="bg-amber-500 text-white">NEW</Badge>
              Premium
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/visas')}
              className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Search className="w-5 h-5 text-slate-600" />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {user.email?.split('@')[0]}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t"
            >
              <nav className="py-4 space-y-2">
                <Link
                  to="/visas"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Find Visas
                </Link>
                <Link
                  to="/lawyers"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Find Lawyers
                </Link>
                <Link
                  to="/premium"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-amber-600 hover:bg-amber-50 font-medium"
                >
                  Premium
                </Link>
                <hr className="my-4" />
                <p className="px-4 text-xs font-semibold text-slate-400 uppercase">Visa Categories</p>
                {visaCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50"
                  >
                    <cat.icon className="w-5 h-5 text-blue-600" />
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default ModernNavbar;
