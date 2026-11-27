'use client';

import { useMemo, useState } from 'react';
import { WritingCard } from '@/components/writing/WritingCard';
import { WritingFrontmatter } from '@/types/content';

const CATEGORY_LABELS = {
  all: 'All',
  technical: 'Technical',
  historical: 'Historical',
  creative: 'Creative',
} as const;

type CategoryKey = keyof typeof CATEGORY_LABELS;

export function WritingList({ posts }: { posts: WritingFrontmatter[] }) {
  const [category, setCategory] = useState<CategoryKey>('all');

  const filteredPosts = useMemo(() => {
    if (category === 'all') return posts;
    return posts.filter((post) => post.category === category);
  }, [category, posts]);

  return (
    <div className="concrete-block concrete-edge overflow-hidden">
      <div className="border-b border-concrete-700/60 concrete-edge bg-[var(--color-concrete-block)]">
        <div className="grid grid-cols-2 sm:flex gap-0" role="group" aria-label="Filter posts by category">
          {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key, index) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              aria-pressed={category === key}
              aria-controls="writing-results"
              className={[
                'sm:flex-1 text-center font-mono text-[0.65rem] tracking-[0.2em] sm:tracking-[0.25em] uppercase px-3 sm:px-5 py-4 sm:py-5 transition-all duration-150 border-concrete-700/60 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0000EE]',
                index % 2 === 0 ? 'border-r' : 'sm:border-r',
                index < 2 && 'border-b sm:border-b-0',
                index === 3 && 'sm:border-r-0',
                category === key
                  ? 'text-concrete-950 font-semibold bg-concrete-300/85'
                  : 'text-concrete-800 hover:text-concrete-950 hover:bg-concrete-300/40',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
      </div>
      <div id="writing-results" className="space-y-0">
        {filteredPosts.map((post) => (
          <WritingCard key={post.slug} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <p className="font-mono text-xs text-concrete-800 tracking-wider px-6 py-12 text-center">
            Nothing here yet.
          </p>
        )}
      </div>
      <p className="sr-only" role="status">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
        {category !== 'all' ? ` in ${CATEGORY_LABELS[category]}` : ''}
      </p>
    </div>
  );
}
