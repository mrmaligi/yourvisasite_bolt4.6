interface TrackerChartsProps {
  p25: number;
  median: number;
  p75: number;
  avg: number;
  className?: string;
}

export function TrackerCharts({ p25, median, p75, avg, className = '' }: TrackerChartsProps) {
  const maxVal = Math.max(p75 * 1.2, avg * 1.2, 1);

  const getPct = (val: number) => Math.min((val / maxVal) * 100, 100);

  const left = getPct(p25);
  const width = getPct(p75) - left;
  const medianPos = getPct(median);

  return (
    <div className={`mt-4 ${className}`}>
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <span>0d</span>
        <span>{Math.round(maxVal)}d+</span>
      </div>
      <div className="relative h-6 bg-neutral-100 rounded-full overflow-hidden w-full">
        {/* Range Bar (p25 to p75) */}
        <div
          className="absolute h-full bg-primary-200/50 border-x border-primary-300"
          style={{ left: `${left}%`, width: `${width}%` }}
          title={`Typical range: ${Math.round(p25)} - ${Math.round(p75)} days`}
        />

        {/* Median Marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary-600 z-10"
          style={{ left: `${medianPos}%` }}
          title={`Median: ${Math.round(median)} days`}
        />
      </div>

      {/* Labels */}
      <div className="relative h-4 mt-1 text-xs text-neutral-500">
         {/* p25 label */}
         <span
           className="absolute transform -translate-x-1/2"
           style={{ left: `${left}%` }}
         >
           {Math.round(p25)}
         </span>

         {/* Median label */}
         <span
           className="absolute transform -translate-x-1/2 font-bold text-primary-700"
           style={{ left: `${medianPos}%` }}
         >
           {Math.round(median)}
         </span>

         {/* p75 label */}
         <span
           className="absolute transform -translate-x-1/2"
           style={{ left: `${left + width}%` }}
         >
           {Math.round(p75)}
         </span>
      </div>
    </div>
  );
}
