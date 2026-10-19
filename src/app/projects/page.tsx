import { Container } from '@/components/layout/Container';
import { ProjectList } from '@/components/projects/ProjectList';
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
      <ProjectList projects={sortedProjects} />
    </Container>
  );
}
