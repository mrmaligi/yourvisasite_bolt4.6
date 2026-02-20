import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock, Users } from 'lucide-react';
import type { TrackerStats, VisaCategory } from '../../types/database';

interface VisaInfo {
  subclass: string;
  name: string;
  category: VisaCategory;
}

interface TrackerData extends TrackerStats {
  visas: VisaInfo;
}

interface Props {
  data: TrackerData;
  onClick?: () => void;
}

function getSpeedBadge(days: number) {
  if (days <= 30) return { label: 'Fast', variant: 'success' as const }; // Example thresholds
  if (days <= 90) return { label: 'Moderate', variant: 'warning' as const };
  return { label: 'Slow', variant: 'danger' as const };
}

function VisualBar({ p25, median, p75, avg }: { p25: number; median: number; p75: number; avg: number }) {
  const maxVal = Math.max(p75 * 1.2, avg * 1.2, 1);
  const getPct = (val: number) => Math.min((val / maxVal) * 100, 100);

  const left = getPct(p25);
  const width = getPct(p75) - left;
  const medianPos = getPct(median);

  return (
    <div className="mt-4">
      <div className="relative h-4 sm:h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden w-full">
        {/* Range Bar (p25 to p75) */}
        <div
          className="absolute h-full bg-primary-200/50 dark:bg-primary-900/30 border-x border-primary-300 dark:border-primary-700"
          style={{ left: `${left}%`, width: `${width}%` }}
        />

        {/* Median Marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary-600 z-10"
          style={{ left: `${medianPos}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] sm:text-xs text-neutral-500 mt-1">
         <span style={{ paddingLeft: `${Math.max(0, left - 5)}%` }}>{Math.round(p25)}d</span>
         <span style={{ paddingLeft: `${Math.max(0, medianPos - left - 5)}%`, fontWeight: 'bold' }}>{Math.round(median)}d</span>
         <span style={{ paddingRight: `${Math.max(0, 100 - (left + width) - 5)}%` }}>{Math.round(p75)}d</span>
      </div>
    </div>
  );
}

export function TrackerStatsCard({ data, onClick }: Props) {
  const avgDays = Math.round(data.weighted_avg_days || 0);
  const badge = getSpeedBadge(avgDays);

  return (
    <Card hover className="h-full flex flex-col cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
      <CardBody className="flex flex-col h-full p-4 sm:p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="default" className="mb-2">{data.visas.subclass}</Badge>
            <h3 className="font-bold text-neutral-900 dark:text-white leading-tight line-clamp-2 min-h-[1.5em]">
              {data.visas.name}
            </h3>
            <p className="text-xs text-neutral-500 capitalize mt-1">{data.visas.category}</p>
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-neutral-100 dark:border-neutral-800 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
              <Clock className="w-3 h-3" />
              <p className="text-xs uppercase tracking-wide">Average</p>
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{avgDays}d</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-neutral-400 mb-1">
              <Users className="w-3 h-3" />
              <p className="text-xs uppercase tracking-wide">Reports</p>
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{data.total_entries}</p>
          </div>
        </div>

        <div className="flex-1 flex items-end">
           <div className="w-full">
             <p className="text-xs text-neutral-400 mb-1">Processing Range (25th - 75th percentile)</p>
             <VisualBar
               p25={data.p25_days || 0}
               median={data.median_days || 0}
               p75={data.p75_days || 0}
               avg={data.weighted_avg_days || 0}
             />
           </div>
        </div>
      </CardBody>
    </Card>
  );
}
