import { Link } from 'react-router-dom';
import { Scale, Upload, Gift, ArrowRight } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';

const actions = [
  {
    to: '/lawyers',
    icon: Scale,
    label: 'Book Lawyer',
    desc: 'Get expert advice',
    color: 'bg-indigo-100 text-indigo-600',
    hover: 'hover:bg-indigo-50'
  },
  {
    to: '/dashboard/documents',
    icon: Upload,
    label: 'Upload Doc',
    desc: 'Secure storage',
    color: 'bg-teal-100 text-teal-600',
    hover: 'hover:bg-teal-50'
  },
  {
    to: '/quiz',
    icon: Gift,
    label: 'Take Quiz',
    desc: 'Check eligibility',
    color: 'bg-amber-100 text-amber-600',
    hover: 'hover:bg-amber-50'
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.label} to={action.to}>
            <Card hover className={`h-full border-transparent transition-all duration-300 ${action.hover}`}>
              <CardBody className="flex items-center gap-4 p-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{action.label}</h3>
                  <p className="text-xs text-neutral-500">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </CardBody>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
