interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5, className = '' }: { cols?: number; className?: string }) {
  return (
    <tr className={className}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3 block md:table-cell border-b md:border-b-0 last:border-0 border-neutral-50">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function VisaCardSkeleton() {
  return (
    <div className="card h-full flex flex-col">
      <div className="p-6 flex-1 space-y-4">
        <div className="flex justify-between items-start">
           <div className="flex gap-2">
             <Skeleton className="h-6 w-16 rounded-md" />
             <Skeleton className="h-6 w-20 rounded-md" />
           </div>
           <Skeleton className="h-4 w-4 rounded-md" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700 flex justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
}

export function LawyerCardSkeleton() {
  return (
    <div className="card p-6 space-y-4 h-full">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </div>
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-700 flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}

export function TrackerCardSkeleton() {
   return (
    <div className="card p-6 space-y-4 h-full flex flex-col">
        <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-neutral-100 dark:border-neutral-700">
            <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-1 flex flex-col items-end">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-8 w-16" />
            </div>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
            </div>
             <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
        <div className="pt-2 mt-auto">
             <Skeleton className="h-6 w-full rounded-full" />
             <div className="flex justify-between mt-1">
                 <Skeleton className="h-3 w-8" />
                 <Skeleton className="h-3 w-8" />
             </div>
        </div>
    </div>
   );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6 flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card p-4 flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2 min-w-0">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-3 w-16 flex-shrink-0" />
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
             <div className="card p-6 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-neutral-100 dark:border-neutral-700 rounded-xl">
                        <Skeleton className="w-5 h-5 rounded-full" />
                         <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
}

export function VisaDetailSkeleton() {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
             <Skeleton className="h-4 w-12" />
             <Skeleton className="h-4 w-4" />
             <Skeleton className="h-4 w-16" />
             <Skeleton className="h-4 w-4" />
             <Skeleton className="h-4 w-32" />
        </div>

        <Skeleton className="h-5 w-32 mb-8" />

        <div className="mb-10">
            <div className="flex gap-3 mb-4">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
            </div>
            <Skeleton className="h-10 w-3/4 mb-6" />

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 card">
                {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                ))}
             </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                 <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="card p-6">
                         <Skeleton className="h-4 w-full mb-2" />
                         <Skeleton className="h-4 w-full mb-2" />
                         <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="card p-6 space-y-6">
                    <Skeleton className="h-6 w-48" />
                    <div className="text-center space-y-2">
                        <Skeleton className="h-10 w-32 mx-auto" />
                        <Skeleton className="h-4 w-24 mx-auto" />
                    </div>
                    <Skeleton className="h-8 w-full rounded-full" />
                </div>
                 <div className="card p-6 space-y-4">
                     <Skeleton className="h-6 w-40" />
                     {Array.from({length: 3}).map((_, i) => (
                         <div key={i} className="flex justify-between items-center">
                             <div className="space-y-1">
                                 <Skeleton className="h-4 w-24" />
                                 <Skeleton className="h-3 w-32" />
                             </div>
                             <Skeleton className="h-3 w-16" />
                         </div>
                     ))}
                 </div>
            </div>
        </div>
      </div>
    );
}
