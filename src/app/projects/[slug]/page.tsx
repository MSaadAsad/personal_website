import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Tag } from '@/components/ui/Tag';
import { formatDate } from '@/lib/utils';
import { projects } from '@/content/data/projects';
import { extractHeadings } from '@/lib/mdx';
import { TableOfContents } from '@/components/ui/TableOfContents';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) return {};
    return {
      title: project.title,
      description: project.description,
    };
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const combinedTags = Array.from(new Set([...project.techStack, ...project.tags]));
  let MDXContent: React.ComponentType | null = null;

  try {
    MDXContent = (await import(`@/content/projects/${slug}.mdx`)).default;
  } catch {
    MDXContent = null;
  }

  const mdxPath = path.join(process.cwd(), 'src/content/projects', `${slug}.mdx`);
  const rawContent = fs.existsSync(mdxPath) ? fs.readFileSync(mdxPath, 'utf-8') : '';
  const headings = extractHeadings(rawContent);

  return (
    <Container className="py-24">
      <Link
        href="/projects"
        className="font-mono text-[0.75rem] text-concrete-600 hover:text-[#0000EE] transition-colors duration-150 mb-10 inline-block tracking-wider"
      >
        &larr; ALL PROJECTS
      </Link>

      <article className="concrete-block concrete-edge p-8 md:p-10">
        <header className="mb-12 border-l-[6px] pl-8 border-l-[#0000EE]">
          <div className="flex items-center gap-4 mb-5 font-mono text-[0.75rem] text-concrete-600 tracking-wider">
            <span>{formatDate(project.date)}</span>
          </div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            {project.title}
          </h1>
          <p className="mt-5 font-serif text-[1.35rem] text-concrete-700 leading-relaxed">
            {project.description}
          </p>
          {(project.url || project.repoUrl) && (
            <div className="mt-4 flex flex-wrap gap-4 font-mono text-[0.7rem] tracking-wider">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0000EE] hover:underline underline-offset-4 transition-colors duration-150"
                >
                  Live &rarr;
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0000EE] hover:underline underline-offset-4 transition-colors duration-150"
                >
                  Source &rarr;
                </a>
              )}
            </div>
          )}
          {combinedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-8">
              {combinedTags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </header>

        <div className="max-w-3xl">
          <TableOfContents headings={headings} />
          {MDXContent && <MDXContent />}
        </div>
      </article>
    </Container>
  );
}
