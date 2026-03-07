import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ModernLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ModernLayout({ children, className = '' }: ModernLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-lg text-slate-600">{subtitle}</p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </motion.div>
      </div>
    </div>
  );
}

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
}

export function ContentContainer({ children, className = '' }: ContentContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function ModernCard({ children, className = '', hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface StatsProps {
  items: { label: string; value: string | number; icon?: ReactNode }[];
}

export function StatsBar({ items }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center"
        >
          {item.icon && <div className="flex justify-center mb-2">{item.icon}</div>}
          <div className="text-3xl font-bold text-blue-600">{item.value}</div>
          <div className="text-sm text-slate-500">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default {
  ModernLayout,
  PageHeader,
  ContentContainer,
  ModernCard,
  StatsBar
};
