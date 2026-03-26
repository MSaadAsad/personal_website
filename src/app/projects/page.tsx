import { Container } from '@/components/layout/Container';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ToLetCard } from '@/components/ToLetCard';
import { projects } from '@/content/data/projects';

export const metadata = {
  title: 'Projects',
  description: 'Things I\'ve built.',
};

export default function ProjectsPage() {
  const sortedProjects = [...projects].sort((a, b) => {
    const aTime = Date.parse(a.date);
    const bTime = Date.parse(b.date);

    if (Number.isFinite(aTime) && Number.isFinite(bTime)) {
      return bTime - aTime;
    }

    if (Number.isFinite(aTime)) return -1;
    if (Number.isFinite(bTime)) return 1;

    return a.title.localeCompare(b.title);
  });

  const groupedProjects = sortedProjects.reduce((acc, project) => {
    const time = Date.parse(project.date);
    const year = Number.isFinite(time) ? String(new Date(time).getFullYear()) : 'Other';

    if (!acc.has(year)) {
      acc.set(year, []);
    }

    acc.get(year)?.push(project);
    return acc;
  }, new Map<string, typeof projects>());

  return (
    <Container className="pt-14 min-h-screen">
      <div className="concrete-block concrete-edge concrete-header mt-32">
        <div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            PROJECTS
          </h1>
          <div className="section-divider" />
          <p className="mt-3 text-base text-concrete-700 font-mono max-w-2xl leading-relaxed">
            Things I&apos;ve built.
          </p>
        </div>
      </div>
      <div className="concrete-block concrete-edge" style={{ backgroundColor: 'transparent', borderColor: 'rgba(74,74,72,1)', boxShadow: '0 16px 22px rgba(46,46,44,0.28)' }}>
        <div className="space-y-0">
          {Array.from(groupedProjects.entries()).map(([year, yearProjects], index, array) => (
            <div
              key={year}
              className={[
                'border-b border-concrete-700',
                index === array.length - 1 && 'border-b-0',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="px-6 py-4 font-mono text-[0.65rem] tracking-[0.35em] uppercase text-concrete-700 bg-[var(--color-concrete-block)]">
                {year}
              </div>
              <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
                {yearProjects.map((project) => (
                  <div key={project.slug} style={{ backgroundColor: 'var(--color-concrete-block)' }}>
                    <ProjectCard project={project} />
                  </div>
                ))}
                {Array.from({ length: (3 - (yearProjects.length % 3)) % 3 }, (_, i) => (
                  <ToLetCard key={`to-let-${i}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
