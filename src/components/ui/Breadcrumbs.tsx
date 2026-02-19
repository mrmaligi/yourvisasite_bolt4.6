import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const LABEL_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  visas: 'Visas',
  lawyers: 'Lawyers',
  news: 'News',
  tracker: 'Tracker',
  marketplace: 'Marketplace',
  pricing: 'Pricing',
  login: 'Login',
  register: 'Register',
  settings: 'Settings',
  documents: 'Documents',
  consultations: 'Consultations',
  premium: 'Premium Content',
  saved: 'Saved Visas',
  clients: 'Clients',
  availability: 'Availability',
  marketing: 'Marketing',
  activity: 'Activity Log',
  users: 'Users',
  admin: 'Admin',
  'book-consultation': 'Book Consultation',
  'my-visas': 'My Visas',
  'my-documents': 'My Documents',
  'my-purchases': 'My Purchases',
};

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const location = useLocation();

  let breadcrumbs: BreadcrumbItem[] = items || [];

  if (!items) {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    breadcrumbs = [
      { label: 'Home', to: '/' },
      ...pathSegments.map((segment, index) => {
        const to = `/${pathSegments.slice(0, index + 1).join('/')}`;

        let label = LABEL_MAP[segment.toLowerCase()];

        if (!label) {
            // Check if it's likely an ID (long string or numbers)
             if (segment.length > 20 || !isNaN(Number(segment))) {
                 label = 'Detail'; // Generic fallback for IDs if not overridden
             } else {
                 // Convert kebab-case to Title Case
                 label = segment
                   .split('-')
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                   .join(' ');
             }
        }

        const isLast = index === pathSegments.length - 1;

        return {
          label,
          to: isLast ? undefined : to
        };
      })
    ];
  }

  if (breadcrumbs.length <= 1 && breadcrumbs[0]?.label === 'Home') {
      return null; // Don't show breadcrumbs if only Home is present
  }

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-sm text-neutral-500 ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap">
        {breadcrumbs.map((item, index) => {
           const isLast = index === breadcrumbs.length - 1;
           return (
             <li key={index} className="flex items-center gap-2">
               {index > 0 && <ChevronRight className="w-4 h-4 text-neutral-400" />}
               {item.to && !isLast ? (
                 <Link to={item.to} className="hover:text-primary-600 transition-colors flex items-center gap-1">
                   {index === 0 && item.label === 'Home' ? <Home className="w-3.5 h-3.5" /> : null}
                   {item.label}
                 </Link>
               ) : (
                 <span className={`font-medium ${isLast ? 'text-neutral-900' : ''} flex items-center gap-1`}>
                    {index === 0 && item.label === 'Home' ? <Home className="w-3.5 h-3.5" /> : null}
                    {item.label}
                 </span>
               )}
             </li>
           );
        })}
      </ol>
    </nav>
  );
}
