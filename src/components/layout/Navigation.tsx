'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/projects', label: 'PROJECTS' },
  { href: '/writing', label: 'WRITING' },
  { href: '/shelf', label: 'SHELF' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-concrete-block)] border-b border-concrete-700/60 shadow-[0_6px_16px_rgba(46,46,44,0.18)]">
        <div className="mx-auto max-w-6xl px-6 md:px-8 h-14 flex items-stretch">
          <div className="hidden md:flex w-full items-stretch">
            <Link
              href="/"
            className="font-mono text-[0.9rem] font-bold text-concrete-900 tracking-[0.2em] hover:text-[#0000EE] transition-colors duration-150 border-r border-concrete-700/60 flex-1 flex items-center justify-center"
            >
              SAAD
            </Link>
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                'relative font-mono text-[0.78rem] tracking-[0.15em] transition-colors duration-150 flex-1 flex items-center justify-center border-r border-concrete-700/60',
                  index === links.length - 1 && 'border-r-0',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-concrete-900 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#0000EE]'
                    : 'text-concrete-700 hover:text-concrete-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="md:hidden font-mono text-[0.9rem] font-bold text-concrete-900 tracking-[0.2em] hover:text-[#0000EE] transition-colors duration-150 border-r border-concrete-700/60 px-4 flex items-center"
          >
            SAAD
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden font-mono text-[0.78rem] tracking-wider text-concrete-700 hover:text-[#0000EE] transition-colors duration-150 ml-auto px-4 flex items-center border-l border-concrete-700/60"
          >
            [{mobileOpen ? 'CLOSE' : 'MENU'}]
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--color-concrete-block)] flex flex-col items-start justify-center px-12">
          <div className="space-y-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block font-mono text-2xl font-bold tracking-tight transition-colors duration-150',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-steel-600'
                    : 'text-concrete-700 hover:text-concrete-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="absolute bottom-12 left-12 font-mono text-[0.65rem] text-concrete-600">
            ESC to close
          </div>
        </div>
      )}
    </>
  );
}
