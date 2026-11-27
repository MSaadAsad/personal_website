import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/content';

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const isUnoptimized = Boolean(
    project.image && (project.image.endsWith('.gif') || project.image.endsWith('.svg'))
  );

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group concrete-card concrete-edge overflow-hidden block h-full w-full max-w-full"
    >
      <div className="aspect-[4/3] bg-concrete-300/70 border-b border-concrete-700/50 shadow-[inset_0_3px_10px_rgba(46,46,44,0.28),inset_0_-1px_4px_rgba(255,255,255,0.2)] flex items-center justify-center p-3">
        {project.image ? (
          <div className="relative w-full aspect-[3/2] overflow-hidden border-2 border-concrete-900/70 bg-concrete-200 shadow-[0_5px_10px_rgba(46,46,44,0.18)]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority={priority}
              unoptimized={isUnoptimized}
              sizes="(min-width: 1024px) 384px, (min-width: 768px) 48vw, 92vw"
              className={`object-cover ${project.slug === 'naya-naqsha' ? 'object-top' : ''}`}
            />
          </div>
        ) : (
          <div className="text-center px-6">
            <div className="font-mono text-[0.65rem] text-concrete-800 tracking-[0.2em] uppercase">
              Project
            </div>
            <div className="font-mono text-[0.65rem] text-concrete-700 mt-2">
              {project.date}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3 min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="font-mono text-[0.75rem] font-semibold text-concrete-900 truncate">
            {project.title}
          </h3>
          <p className="mt-1 font-mono text-[0.65rem] text-concrete-800 line-clamp-2">
            {project.description}
          </p>
          <span className="mt-1 block font-mono text-[0.6rem] text-concrete-700 tracking-wider">
            {project.date}
          </span>
        </div>
        <span
          className="font-mono text-[0.65rem] text-concrete-800 border border-concrete-700/70 px-3 py-1 bg-concrete-300/70 group-hover:bg-[#0000EE] group-hover:text-white group-hover:border-[#0000EE] transition-colors duration-150 shrink-0"
        >
          OPEN
        </span>
      </div>
    </Link>
  );
}
