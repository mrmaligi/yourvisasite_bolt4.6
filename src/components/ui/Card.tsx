import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }>(
  ({ className = '', children, hover, onClick, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={`${hover || onClick ? 'cursor-pointer' : ''} card ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e as any) : undefined}
      whileHover={hover ? { y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" } : undefined}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-b border-neutral-100 dark:border-neutral-700/50 ${className}`}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-neutral-500 ${className}`}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

// Add CardBody as alias for CardContent for backward compatibility
export const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`px-6 py-5 ${className}`} {...props} />
  )
);
CardBody.displayName = 'CardBody';

export const CardContent = CardBody;

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-t border-neutral-100 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-900/50 rounded-b-2xl ${className}`}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
