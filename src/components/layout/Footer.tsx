import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-concrete-700/60 bg-[var(--color-concrete-block)] mt-32">
      <Container className="py-0 flex flex-col md:flex-row items-stretch">
        <div className="font-mono text-[0.78rem] text-concrete-600 tracking-wider px-6 py-4 border-b md:border-b-0 md:border-r border-concrete-700/60 flex items-center justify-center flex-1">
          &copy; {new Date().getFullYear()} SAAD
        </div>
        <div className="flex flex-col md:flex-row flex-1">
          <Link
            href="/contact"
            className="font-mono text-[0.78rem] text-concrete-700 hover:text-[#0000EE] transition-colors duration-150 tracking-wider px-6 py-4 flex items-center justify-center flex-1"
          >
            CONTACT
          </Link>
        </div>
      </Container>
    </footer>
  );
}
