import { Button, ButtonProps } from '../ui/Button';
import { cn } from '../../lib/utils';

interface MobileButtonProps extends ButtonProps {
  fullWidth?: boolean;
}

export function MobileButton({
  className,
  fullWidth = true,
  size = 'lg',
  ...props
}: MobileButtonProps) {
  return (
    <Button
      className={cn(
        "h-12 text-base font-medium rounded-xl active:scale-95 transition-transform",
        fullWidth && "w-full",
        className
      )}
      size={size}
      {...props}
    />
  );
}
