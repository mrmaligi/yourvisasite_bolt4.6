import { Link } from 'react-router-dom';
import { User, Briefcase, ArrowRight, Shield, CheckCircle } from 'lucide-react';

export function RoleSelectV2() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Welcome to VisaBuild</h1>
          <p className="text-slate-600 text-lg">Choose how you'd like to continue</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Applicant Card */}
          <div className="bg-white border-2 border-slate-200 p-8 hover:border-blue-500 transition-all group">
            <div className="w-16 h-16 bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <User className="w-8 h-8 text-blue-600 group-hover:text-white" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">Visa Applicant</h2>
            <p className="text-slate-600 mb-6">
              I'm applying for an Australian visa and want to track my application, 
              find information, or connect with migration professionals.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'Track visa processing times',
                'Access visa guides & checklists', 
                'Connect with migration lawyers',
                'Submit timeline data anonymously',
                'Get application reminders'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Link
                to="/register"
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center"
              >
                Create Applicant Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Lawyer Card */}
          <div className="bg-white border-2 border-slate-200 p-8 hover:border-indigo-500 transition-all group">
            <div className="w-16 h-16 bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
              <Briefcase className="w-8 h-8 text-indigo-600 group-hover:text-white" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">Migration Lawyer</h2>
            <p className="text-slate-600 mb-6">
              I'm a registered migration agent or lawyer looking to connect with 
              clients, manage cases, and grow my practice.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'Manage client cases & documents',
                'Receive consultation requests',
                'Showcase your expertise',
                'Track client applications',
                'Grow your client base'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Link
                to="/lawyer/register"
                className="w-full py-3 px-4 bg-indigo-600 text-white font-medium hover:bg-indigo-700 flex items-center justify-center"
              >
                Register as Lawyer
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <p className="text-center text-sm text-slate-600">
                Already registered?{' '}
                <Link to="/lawyer/login" className="text-indigo-600 hover:underline font-medium">
                  Lawyer Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-500">
            Need help?{' '}
            <Link to="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectV2;
