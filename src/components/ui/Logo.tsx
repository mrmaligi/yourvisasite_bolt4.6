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
  const textColor = variant === 'dark' ? 'text-navy-700' : 'text-white';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${s.box} relative bg-navy-600 flex items-center justify-center rounded`}>
        <span className={`${s.text} font-bold tracking-wide text-white uppercase`}>UVS</span>
        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${s.brand} font-heading font-bold ${textColor}`}>
            VisaBuild
          </span>
        </div>
      )}
    </div>
  );
}
