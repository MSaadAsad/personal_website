"use client";

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ToLetCard } from '@/components/ToLetCard';
import type { Project } from '@/types/content';

function projectYear(project: Project): string {
  const time = Date.parse(project.date);
  return Number.isFinite(time) ? String(new Date(time).getUTCFullYear()) : 'Other';
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const [year, setYear] = useState('all');
  const years = useMemo(() => [...new Set(projects.map(projectYear))].sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return Number(b) - Number(a);
  }), [projects]);
  const visible = year === 'all' ? projects : projects.filter(project => projectYear(project) === year);

  const lgFillers = visible.length > 0 ? (3 - (visible.length % 3)) % 3 : 0;
  const mdFiller = visible.length > 0 && visible.length % 2 === 1;

  return (
    <div className="concrete-block concrete-edge overflow-hidden" style={{ backgroundColor: "transparent", backgroundImage: "none", borderColor: "rgba(74,74,72,1)", boxShadow: "0 16px 22px rgba(46,46,44,0.28)" }}>
      <div className="border-b border-concrete-700/60 concrete-edge bg-[var(--color-concrete-block)]">
        <div className="flex flex-wrap gap-0" role="group" aria-label="Filter projects by year">
          {['all', ...years].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setYear(key)}
              aria-pressed={year === key}
              aria-controls="project-results"
              className={[
                'flex-1 min-w-[4rem] text-center font-mono text-[0.65rem] tracking-[0.2em] sm:tracking-[0.25em] uppercase px-3 sm:px-5 py-4 sm:py-5 transition-all duration-150 border-r border-concrete-700/60 last:border-r-0 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0000EE]',
                year === key ? 'text-concrete-950 font-semibold bg-concrete-300/85' : 'text-concrete-800 hover:text-concrete-950 hover:bg-concrete-300/40',
              ].filter(Boolean).join(' ')}
            >
              {key === 'all' ? 'All' : key}
            </button>
          ))}
        </div>
      </div>
      <div id="project-results" className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, index) => (
          <div key={project.slug} className="min-w-0" style={{ backgroundColor: 'var(--color-concrete-block)' }}>
            <ProjectCard project={project} priority={index < 3} />
          </div>
        ))}
        {mdFiller && (
          <ToLetCard key={`to-let-md-${year}`} className="hidden md:flex lg:hidden" />
        )}
        {Array.from({ length: lgFillers }, (_, i) => (
          <ToLetCard key={`to-let-lg-${year}-${i}`} className="hidden lg:flex" />
        ))}
      </div>
      <p className="sr-only" role="status">{visible.length} projects{year !== 'all' ? ` from ${year}` : ''}</p>
    </div>
  );
}
