import Link from 'next/link';
import { Project } from '@/types/content';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="concrete-card concrete-edge overflow-hidden block"
    >
      <div className="aspect-[4/3] bg-concrete-300/70 border-b border-concrete-700/50 flex items-center justify-center">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-contain p-1 border-2 border-concrete-900/70"
          />
        ) : (
          <div className="text-center px-6">
            <div className="font-mono text-[0.65rem] text-concrete-700 tracking-[0.2em] uppercase">
              Project
            </div>
            <div className="font-mono text-[0.65rem] text-concrete-600 mt-2">
              {project.date}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <h3 className="font-mono text-[0.75rem] font-semibold text-concrete-700 truncate">
            {project.title}
          </h3>
          <p className="mt-1 font-mono text-[0.65rem] text-concrete-600 line-clamp-2">
            {project.description}
          </p>
          <span className="mt-1 block font-mono text-[0.6rem] text-concrete-600 tracking-wider">
            {project.date}
          </span>
        </div>
        <span
          className="font-mono text-[0.65rem] text-concrete-700 border border-concrete-700/70 px-3 py-1 bg-concrete-300/70 hover:text-concrete-900 transition-colors duration-150 shrink-0"
        >
          OPEN
        </span>
      </div>
    </Link>
  );
}
