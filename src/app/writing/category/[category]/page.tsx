import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { WritingCard } from '@/components/writing/WritingCard';
import { getWritingByCategory } from '@/lib/mdx';

const CATEGORY_LABELS = {
  technical: 'TECHNICAL',
  historical: 'HISTORICAL',
  creative: 'CREATIVE',
} as const;

type CategoryKey = keyof typeof CATEGORY_LABELS;

export function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  return params.then(({ category }) => {
    if (!(category in CATEGORY_LABELS)) return {};
    const label = CATEGORY_LABELS[category as CategoryKey];
    return {
      title: `Writing / ${label}`,
      description: `Writing in the ${label.toLowerCase()} category.`,
    };
  });
}

export default async function WritingCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!(category in CATEGORY_LABELS)) notFound();

  const posts = getWritingByCategory(category);
  const label = CATEGORY_LABELS[category as CategoryKey];

  return (
    <Container className="py-24">
      <Link
        href="/writing"
        className="font-mono text-[0.65rem] text-concrete-600 hover:text-[#0000EE] transition-colors duration-150 mb-10 inline-block tracking-wider"
      >
        &larr; ALL WRITING
      </Link>
      <div className="concrete-block concrete-edge concrete-header">
        <header className="mb-0">
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            {`WRITING / ${label}`}
          </h1>
          <p className="mt-5 text-base text-concrete-700 font-mono max-w-2xl leading-relaxed">
            {`Essays and notes tagged ${label.toLowerCase()}.`}
          </p>
          <div className="mt-8 h-px bg-gradient-to-r from-steel-500/60 to-transparent" />
        </header>
      </div>
      <div className="concrete-block concrete-edge">
        <div className="concrete-inner">
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
      </div>
    </Container>
  );
}
