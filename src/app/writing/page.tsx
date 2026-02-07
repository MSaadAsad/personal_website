import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { WritingCard } from '@/components/writing/WritingCard';
import { Tag } from '@/components/ui/Tag';
import { getAllWriting } from '@/lib/mdx';

export const metadata = {
  title: 'Writing',
  description: 'Essays, explorations, and creative work.',
};

export default function WritingPage() {
  const posts = getAllWriting();

  return (
    <Container className="pt-14 min-h-screen">
      <div className="concrete-block concrete-edge concrete-header mt-32">
        <div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            WRITING
          </h1>
          <div className="section-divider" />
          <p className="mt-3 text-base text-concrete-700 font-mono max-w-2xl leading-relaxed">
            Essays, explorations, and creative work.
          </p>
        </div>
      </div>
      <div className="concrete-block concrete-edge">
        <div className="border-b border-concrete-700/60 concrete-edge bg-[var(--color-concrete-block)]">
          <div className="flex gap-0">
            <Link
              href="/writing"
              className="font-mono text-[0.65rem] tracking-[0.25em] uppercase px-6 py-5 transition-all duration-150 border-r border-concrete-700/60 border-l border-concrete-700/60 text-concrete-900 bg-concrete-300/80"
            >
              All
            </Link>
            <Link
              href="/writing/category/technical"
              className="font-mono text-[0.65rem] tracking-[0.25em] uppercase px-6 py-5 transition-all duration-150 border-r border-concrete-700/60 text-concrete-600 hover:text-concrete-900"
            >
              Technical
            </Link>
            <Link
              href="/writing/category/historical"
              className="font-mono text-[0.65rem] tracking-[0.25em] uppercase px-6 py-5 transition-all duration-150 border-r border-concrete-700/60 text-concrete-600 hover:text-concrete-900"
            >
              Historical
            </Link>
            <Link
              href="/writing/category/creative"
              className="font-mono text-[0.65rem] tracking-[0.25em] uppercase px-6 py-5 transition-all duration-150 border-r border-concrete-700/60 text-concrete-600 hover:text-concrete-900"
            >
              Creative
            </Link>
          </div>
        </div>
        <div className="space-y-0">
            {posts.map((post) => (
              <WritingCard key={post.slug} post={post} />
            ))}
            {posts.length === 0 && (
              <p className="font-mono text-sm text-concrete-600 py-12">
                Nothing here yet.
              </p>
            )}
          </div>
      </div>
    </Container>
  );
}
