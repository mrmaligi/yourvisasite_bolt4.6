import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundV2() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-slate-200 flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-slate-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Page not found</h1>
        
        <p className="text-lg text-slate-600 max-w-md mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <Link to="/">
          <Button variant="primary" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </>
  );
}
