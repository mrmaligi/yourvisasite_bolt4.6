import { Link } from 'react-router-dom';
import { Search, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-neutral-100 rounded-3xl flex items-center justify-center mb-6">
        <Search className="w-12 h-12 text-neutral-400" />
      </div>
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">Page not found</h1>
      <p className="text-lg text-neutral-500 max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link to="/">
        <Button size="lg">
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
