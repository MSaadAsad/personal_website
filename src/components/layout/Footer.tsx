'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  const [variant, setVariant] = useState<'control' | 'test'>('control');

  useEffect(() => {
    const assign = () => {
      const w = window as any;
      if (w.Bayanista?.sessionManager) {
        setVariant(w.Bayanista.experiment('footer-layout-swap'));
        return true;
      }
      return false;
    };

    if (!assign()) {
      window.addEventListener('bayanista:ready', assign, { once: true });
      return () => window.removeEventListener('bayanista:ready', assign);
    }
  }, []);

  const copyright = (
    <div className="font-mono text-[0.78rem] text-concrete-600 tracking-wider px-6 py-4 flex items-center justify-center flex-1">
      &copy; {new Date().getFullYear()} SAAD
    </div>
  );

  const contact = (
    <Link
      href="/contact"
      className="font-mono text-[0.78rem] text-concrete-700 hover:text-[#0000EE] transition-colors duration-150 tracking-wider px-6 py-4 flex items-center justify-center flex-1"
    >
      CONTACT
    </Link>
  );

  return (
    <footer className="border-t border-concrete-700/60 bg-[var(--color-concrete-block)] mt-32">
      <Container className="py-0 flex flex-col md:flex-row items-stretch">
        {variant === 'test' ? (
          <>
            <div className="flex flex-col md:flex-row flex-1 border-b md:border-b-0 md:border-r border-concrete-700/60">
              {contact}
            </div>
            {copyright}
          </>
        ) : (
          <>
            <div className="border-b md:border-b-0 md:border-r border-concrete-700/60 flex items-center justify-center flex-1">
              {copyright}
            </div>
            <div className="flex flex-col md:flex-row flex-1">
              {contact}
            </div>
          </>
        )}
      </Container>
    </footer>
  );
}
