'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BodyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div
      className="min-h-screen"
      style={isHome ? {
        backgroundImage: "url('/assets/homepage-background.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundColor: 'rgba(226, 225, 221, 0.9)',
        backgroundBlendMode: 'multiply',
      } : undefined}
    >
      <div className={cn(!isHome && 'grid-overlay', 'min-h-screen')}>
        {children}
      </div>
    </div>
  );
}
