import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { WritingFrontmatter } from '@/types/content';
import { cn } from '@/lib/utils';

export function WritingCard({ post }: { post: WritingFrontmatter }) {
  const categoryStyles = {
    technical: {
      titleFont: 'font-mono',
    },
    historical: {
      titleFont: 'font-mono',
    },
    creative: {
      titleFont: 'font-mono',
    },
  };

  const style = categoryStyles[post.category];

  return (
    <BrutalistCard
      href={`/writing/${post.slug}`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'text-base font-semibold text-[#0000EE] mb-2',
            style.titleFont
          )}>
            {post.title}
          </h3>
          <p className="font-serif text-sm text-concrete-700 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-mono text-[0.65rem] text-concrete-600 tracking-wider">
          <span>{post.date}</span>
          {post.readingTime && <span>{post.readingTime} min</span>}
        </div>
      </div>
    </BrutalistCard>
  );
}
