import { SuccessStoriesList } from '../../components/growth';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import { Star } from 'lucide-react';

export function SuccessStoriesPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-100/40 via-transparent to-transparent dark:from-yellow-900/20 rounded-[4rem] blur-3xl"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/20 mb-6 text-white transform hover:scale-105 transition-transform duration-300">
            <Star className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 tracking-tight">
            Success Stories
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Real people, real visas, real success. Discover inspiring stories from applicants who navigated the Australian immigration journey.
          </p>
          {user && (
            <Link to="/dashboard/referrals">
              <div className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-lg hover:bg-amber-500 dark:hover:bg-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 hover:-translate-y-1">
                Share Your Story
              </div>
            </Link>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden p-6 md:p-10">
          <SuccessStoriesList />
        </div>
      </div>
    </div>
  );
}
