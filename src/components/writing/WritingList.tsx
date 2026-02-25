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
    <div className="concrete-block concrete-edge">
      <div className="border-b border-concrete-700/60 concrete-edge bg-[var(--color-concrete-block)]">
        <div className="flex gap-0">
          {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key, index) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={[
                'font-mono text-[0.65rem] tracking-[0.25em] uppercase px-6 py-5 transition-all duration-150 border-r border-concrete-700/60',
                index === 0 && 'border-l border-concrete-700/60',
                category === key
                  ? 'text-concrete-900 bg-concrete-300/80'
                  : 'text-concrete-600 hover:text-concrete-900',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-0">
        {filteredPosts.map((post) => (
          <WritingCard key={post.slug} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <p className="font-mono text-sm text-concrete-600 py-12">
            Nothing here yet.
          </p>
        )}
      </div>
    </div>
  );
}
