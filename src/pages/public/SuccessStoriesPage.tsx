import { SuccessStoriesList } from '../../components/growth';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function SuccessStoriesPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Success Stories
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300">
              Real people, real visas, real success
            </p>
          </div>
          {user && (
            <Button as={Link} to="/dashboard/referrals">
              Share Your Story
            </Button>
          )}
        </div>
        <SuccessStoriesList />
      </div>
    </div>
  );
}
