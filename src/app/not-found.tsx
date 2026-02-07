import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export default function NotFound() {
  return (
    <Container className="py-24 min-h-[60vh] flex flex-col justify-center">
      <p className="font-mono text-[0.65rem] text-concrete-700 tracking-[0.25em] mb-4">
        404
      </p>
      <h1 className="text-display font-mono font-bold text-concrete-900 mb-8">
        NOT FOUND
      </h1>
      <p className="font-serif text-lg text-concrete-700 mb-10">
        This page doesn&apos;t exist. It might have once, or it might never have.
      </p>
      <Link
        href="/"
        className="font-mono text-[0.75rem] text-[#0000EE] hover:underline underline-offset-4 inline-block transition-colors duration-150"
      >
        &larr; BACK TO HOME
      </Link>
    </Container>
  );
}
