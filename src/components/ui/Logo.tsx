interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showText?: boolean;
}

const sizes = {
  sm: { box: 'w-8 h-8', text: 'text-[11px]', brand: 'text-base' },
  md: { box: 'w-10 h-10', text: 'text-[13px]', brand: 'text-lg' },
  lg: { box: 'w-12 h-12', text: 'text-[15px]', brand: 'text-xl' },
};

export function Logo({ className = '', size = 'md', variant = 'dark', showText = true }: LogoProps) {
  const s = sizes[size];
  const textColor = variant === 'dark' ? 'text-neutral-900 dark:text-white' : 'text-white';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${s.box} relative rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm`}>
        <span className={`${s.text} font-bold tracking-wide text-white`}>UVS</span>
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${s.brand} font-bold tracking-tight ${textColor}`}>
            VisaBuild
          </span>
        </div>
      )}
    </div>
  );
}
