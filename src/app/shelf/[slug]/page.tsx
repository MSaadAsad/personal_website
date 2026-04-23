import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Tag } from '@/components/ui/Tag';
import { shelf } from '@/content/data/shelf';

export function generateStaticParams() {
  return shelf
    .filter((item) => item.reviewSlug)
    .map((item) => ({ slug: item.reviewSlug! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = shelf.find((entry) => entry.reviewSlug === slug);
  if (!item) return {};
  return {
    title: item.title,
    description: `${item.creator} · ${item.year}`,
  };
}

export default async function ShelfReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = shelf.find((entry) => entry.reviewSlug === slug);
  if (!item) notFound();

  let MDXContent;
  try {
    MDXContent = (await import(`@/content/shelf-reviews/${slug}.mdx`)).default;
  } catch {
    notFound();
  }

  return (
    <Container className="py-24">
      <Link
        href="/shelf"
        className="font-mono text-[0.65rem] text-concrete-700 hover:text-[#0000EE] transition-colors duration-150 mb-10 inline-block tracking-wider"
      >
        &larr; ALL SHELF
      </Link>

      <article className="concrete-block concrete-edge p-8 md:p-10">
        <header className="mb-12 border-l-[6px] pl-8 border-l-[#0000EE]">
          <div className="flex items-center gap-4 mb-5 font-mono text-[0.65rem] text-concrete-700 tracking-wider">
            <span>{item.creator}</span>
            <span>{item.year}</span>
            <span>{item.type.toUpperCase()}</span>
          </div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            {item.title}
          </h1>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-8">
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </header>

        <div className="max-w-3xl">
          <MDXContent />
          {item.url && (
            <div className="mt-8">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-[0.75rem] text-[#0000EE] hover:underline underline-offset-4 transition-colors duration-150"
              >
                Source &rarr;
              </a>
            </div>
          )}
        </div>
      </article>
    </Container>
  );
}
