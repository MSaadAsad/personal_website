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

  return (
    <>
      <div className="border-b border-concrete-700/60 concrete-edge bg-[var(--color-concrete-block)]">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'shrink-0 font-mono text-[0.65rem] tracking-[0.25em] uppercase px-6 py-5 transition-all duration-150 border-r border-concrete-700/60',
                index === 0 && 'border-l border-concrete-700/60',
                filter === tab.value
                  ? 'text-concrete-900 bg-concrete-300/80'
                  : 'text-concrete-600 hover:text-concrete-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div key={item.id} style={{ backgroundColor: 'var(--color-concrete-block)' }}>
            <ShelfItemCard item={item} />
          </div>
        ))}
        {Array.from({ length: (3 - (filtered.length % 3)) % 3 }, (_, i) => (
          <ToLetCard key={`to-let-${i}`} />
        ))}
      </div>
    </>
  );
}
