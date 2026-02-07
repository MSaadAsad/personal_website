'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BodyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className={cn('min-h-screen', !isHome && 'grid-overlay')}>
      {children}
    </div>
  );
}
