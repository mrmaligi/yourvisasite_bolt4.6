import {
  UserPlus,
  Scale,
  CreditCard,
  Clock,
  FileText,
  TrendingUp,
  type LucideIcon,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';

export interface ActivityItem {
  id: string;
  type: 'user_signup' | 'lawyer_registration' | 'purchase' | 'booking' | 'document' | 'tracker' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface ActivityFeedProps {
  title?: string;
  items: ActivityItem[];
  maxItems?: number;
  className?: string;
}

const activityIcons: Record<string, LucideIcon> = {
  user_signup: UserPlus,
  lawyer_registration: Scale,
  purchase: CreditCard,
  booking: Clock,
  document: FileText,
  tracker: TrendingUp,
  system: CheckCircle,
};

const activityColors: Record<string, string> = {
  user_signup: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  lawyer_registration: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  purchase: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  booking: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  document: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  tracker: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400',
  system: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ActivityFeed({ title = 'Recent Activity', items, maxItems = 5, className = '' }: ActivityFeedProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="font-semibold text-neutral-900 dark:text-white">{title}</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {displayItems.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">No recent activity</div>
          ) : (
            displayItems.map((activity) => {
              const Icon = activityIcons[activity.type] || CheckCircle;
              const colorClass = activityColors[activity.type] || activityColors.system;

              return (
                <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      <span className="text-xs text-neutral-400 flex-shrink-0">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardBody>
    </Card>
  );
}
