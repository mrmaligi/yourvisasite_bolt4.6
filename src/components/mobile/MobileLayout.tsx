import React from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileHeader } from './MobileHeader';
import { cn } from '../../lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showNav?: boolean;
  className?: string;
  action?: React.ReactNode;
}

export function MobileLayout({
  children,
  title,
  showBack = false,
  showNav = true,
  className,
  action,
}: MobileLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      <MobileHeader title={title} showBack={showBack} action={action} />
      <main className={cn("flex-1 p-4 overflow-y-auto", className)}>
        {children}
      </main>
      {showNav && <MobileBottomNav />}
    </div>
  );
}
