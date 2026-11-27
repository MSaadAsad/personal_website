'use client';

import { useState } from 'react';
import { ShelfItem } from '@/types/content';
import { ShelfItemCard } from './ShelfItem';
import { ToLetCard } from '@/components/ToLetCard';
import { cn } from '@/lib/utils';

const tabs = [
  { value: 'all', label: 'ALL' },
  { value: 'book', label: 'BOOKS' },
  { value: 'movie', label: 'MOVIES' },
  { value: 'album', label: 'ALBUMS' },
];

export function ShelfGrid({ items }: { items: ShelfItem[] }) {
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all' ? items : items.filter((i) => i.type === filter);

  const activeTab = tabs.find((t) => t.value === filter);
  const lgFillers = filtered.length > 0 ? (3 - (filtered.length % 3)) % 3 : 0;
  const mdFiller = filtered.length > 0 && filtered.length % 2 === 1;

  return (
    <>
      <div className="border-b border-concrete-700/60 concrete-edge bg-[var(--color-concrete-block)]">
        <div className="flex flex-wrap gap-0" role="group" aria-label="Filter shelf by media type">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              aria-pressed={filter === tab.value}
              aria-controls="shelf-results"
              className={cn(
                'flex-1 min-w-[4.5rem] text-center font-mono text-[0.65rem] tracking-[0.2em] sm:tracking-[0.25em] uppercase px-3 sm:px-5 py-4 sm:py-5 transition-all duration-150 border-r border-concrete-700/60 last:border-r-0 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0000EE]',
                filter === tab.value
                  ? 'text-concrete-950 font-semibold bg-concrete-300/85'
                  : 'text-concrete-800 hover:text-concrete-950 hover:bg-concrete-300/40'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div
          id="shelf-results"
          className="px-6 py-14 text-center"
          style={{ backgroundColor: 'var(--color-concrete-block)' }}
        >
          <p className="font-mono text-xs text-concrete-800 tracking-wider">
            No {activeTab ? activeTab.label.toLowerCase() : 'items'} logged yet.
          </p>
        </div>
      ) : (
        <div id="shelf-results" className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="min-w-0" style={{ backgroundColor: 'var(--color-concrete-block)' }}>
              <ShelfItemCard item={item} />
            </div>
          ))}
          {mdFiller && (
            <ToLetCard key={`to-let-md-${filter}`} className="hidden md:flex lg:hidden" />
          )}
          {Array.from({ length: lgFillers }, (_, i) => (
            <ToLetCard key={`to-let-lg-${filter}-${i}`} className="hidden lg:flex" />
          ))}
        </div>
      )}
      <p className="sr-only" role="status">
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        {filter !== 'all' && activeTab ? ` in ${activeTab.label.toLowerCase()}` : ''}
      </p>
    </>
  );
}
