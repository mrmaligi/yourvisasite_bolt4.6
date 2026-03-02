import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function PartnerVisaLanding() {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Bring Your Partner | VisaBuild Resources</title>
        <meta name="description" content="Reunite with your loved ones." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/visas" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Visas
        </Link>

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Bring Your Partner</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">Reunite with your loved ones.</p>

        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-neutral-50 dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Content Coming Soon</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              This resource is currently being updated with the latest information for 2024.
              Please check back soon for the full content.
            </p>
            <div>
              <Button>Notify Me When Available</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
