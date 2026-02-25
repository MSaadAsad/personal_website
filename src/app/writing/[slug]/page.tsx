import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Tag } from '@/components/ui/Tag';
import { getWritingSlugs, getWritingBySlug } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return getWritingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getWritingBySlug(slug);
  if (!result) return {};
  return {
    title: result.frontmatter.title,
    description: result.frontmatter.excerpt,
  };
}

export default async function WritingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getWritingBySlug(slug);
  if (!result) notFound();

  const { frontmatter } = result;

  let MDXContent;
  try {
    MDXContent = (await import(`@/content/writing/${slug}.mdx`)).default;
  } catch {
    notFound();
  }

  const categoryAccent = {
    technical: 'border-l-[#0000EE]',
    historical: 'border-l-[#0000EE]',
    creative: 'border-l-[#0000EE]',
  };

  return (
    <Container className="py-24">
      <Link
        href="/writing"
        className="font-mono text-[0.65rem] text-concrete-600 hover:text-[#0000EE] transition-colors duration-150 mb-10 inline-block tracking-wider"
      >
        &larr; ALL BLOG
      </Link>

      <article className="concrete-block concrete-edge p-8 md:p-10">
        <header className={cn('mb-12 border-l-[6px] pl-8', categoryAccent[frontmatter.category])}>
          <div className="flex items-center gap-4 mb-5 font-mono text-[0.65rem] text-concrete-600 tracking-wider">
            <span>{formatDate(frontmatter.date)}</span>
            {frontmatter.readingTime && (
              <span>{frontmatter.readingTime} min read</span>
            )}
          </div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            {frontmatter.title}
          </h1>
          <p className="mt-5 font-serif text-xl text-concrete-700 leading-relaxed">
            {frontmatter.excerpt}
          </p>
          {frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-8">
              {frontmatter.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </header>

        <div className="max-w-3xl">
          <MDXContent />
        </div>
      </article>
    </Container>
  );
}
