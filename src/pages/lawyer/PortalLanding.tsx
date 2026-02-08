import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';

export function PortalLanding() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role === 'lawyer') {
      navigate('/lawyer/dashboard');
    }
  }, [user, role, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-neutral-900 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-neutral-900/40" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
                Grow Your Immigration Practice with VisaBuild
              </h1>
              <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-2xl">
                Connect with qualified clients, streamline your case management, and build your reputation on the world's most transparent visa platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register/lawyer">
                  <Button className="w-full sm:w-auto h-14 px-8 text-lg font-semibold flex items-center justify-center gap-2">
                    Join as a Lawyer
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm">
                    Sign In to Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why Join VisaBuild?</h2>
              <p className="text-neutral-500 text-lg">We provide the tools and visibility you need to scale your practice efficiently.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Qualified Leads</h3>
                <p className="text-neutral-500 leading-relaxed">
                  Connect with users who are actively seeking legal assistance for their specific visa cases.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Verified Profile</h3>
                <p className="text-neutral-500 leading-relaxed">
                  Stand out with a verified lawyer badge and build trust with transparent reviews and success metrics.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Practice Growth</h3>
                <p className="text-neutral-500 leading-relaxed">
                  Access market insights, manage consultations, and track your performance all in one dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary-600 rounded-3xl overflow-hidden relative shadow-xl">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/3" />
              <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
                  <p className="text-primary-100 text-lg max-w-xl">
                    Join hundreds of immigration lawyers who are growing their practice with VisaBuild.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link to="/register/lawyer">
                    <Button variant="secondary" className="h-14 px-8 text-lg font-semibold bg-white text-primary-600 hover:bg-neutral-50 border-transparent">
                      Create Lawyer Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
