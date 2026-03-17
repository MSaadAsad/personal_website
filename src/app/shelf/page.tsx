import { Container } from '@/components/layout/Container';

export const metadata = {
  title: 'Shelf',
  description: 'Books, movies, and albums that shaped my thinking.',
};

export default function ShelfPage() {
  return (
    <Container className="pt-14 min-h-screen">
      <div className="concrete-block concrete-edge concrete-header mt-32">
        <div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            SHELF
          </h1>
          <div className="section-divider" />
          <p className="mt-3 text-base text-concrete-700 font-mono max-w-2xl leading-relaxed">
            You are what you eat. Notes on what I&apos;ve been consuming.
          </p>
        </div>
      </div>
      <div className="concrete-block concrete-edge">
        <div className="concrete-inner">
          <p className="font-mono text-sm text-concrete-600">On the way.</p>
        </div>
      </div>
    </Container>
  );
}
