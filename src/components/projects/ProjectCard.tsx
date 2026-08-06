import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/content';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="concrete-card concrete-edge overflow-hidden block h-full"
    >
      <div className="aspect-[4/3] bg-concrete-300/70 border-b border-concrete-700/50 flex items-center justify-center p-3">
        {project.image ? (
          <div className="relative w-full aspect-[3/2] overflow-hidden border-2 border-concrete-900/70 bg-concrete-200 shadow-[0_5px_10px_rgba(46,46,44,0.18)]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
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
