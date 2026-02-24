interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
};

export function Loading({ className = '', size = 'md', fullScreen = false }: LoadingProps) {
  const spinner = (
    <div role="status" className={`relative flex items-center justify-center ${className}`}>
      <span className="sr-only">Loading...</span>
      <div className={`${sizeClasses[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin dark:border-primary-800 dark:border-t-primary-500`} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-inherit">
      <Loading />
    </div>
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded ${className}`} />
  );
}
