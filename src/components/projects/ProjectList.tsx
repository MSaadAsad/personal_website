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

  return (
    <div className="concrete-block concrete-edge" style={{ backgroundColor: "transparent", borderColor: "rgba(74,74,72,1)", boxShadow: "0 16px 22px rgba(46,46,44,0.28)" }}>
      <div className="border-b border-concrete-700/60 concrete-edge bg-[var(--color-concrete-block)]">
        <div className="flex gap-0 overflow-x-auto" role="group" aria-label="Filter projects by year">
          {['all', ...years].map((key, index) => (
            <button
              key={key}
              type="button"
              onClick={() => setYear(key)}
              aria-pressed={year === key}
              aria-controls="project-results"
              className={[
                'shrink-0 font-mono text-[0.65rem] tracking-[0.25em] uppercase px-6 py-5 transition-all duration-150 border-r border-concrete-700/60 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0000EE]',
                index === 0 && 'border-l border-concrete-700/60',
                year === key ? 'text-concrete-900 bg-concrete-300/80' : 'text-concrete-600 hover:text-concrete-900',
              ].filter(Boolean).join(' ')}
            >
              {key === 'all' ? 'All' : key}
            </button>
          ))}
        </div>
      </div>
      <div id="project-results" className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
        {visible.map(project => (
          <div key={project.slug} style={{ backgroundColor: 'var(--color-concrete-block)' }}>
            <ProjectCard project={project} />
          </div>
        ))}
        {Array.from({ length: (3 - (visible.length % 3)) % 3 }, (_, i) => (
          <ToLetCard key={`to-let-${year}-${i}`} />
        ))}
      </div>
      <p className="sr-only" role="status">{visible.length} projects{year !== 'all' ? ` from ${year}` : ''}</p>
    </div>
  );
}
