import Link from 'next/link';
import { ShelfItem as ShelfItemType } from '@/types/content';

export function ShelfItemCard({ item }: { item: ShelfItemType }) {
  const content = (
    <>
      <div className="aspect-[4/3] bg-concrete-300/70 border-b border-concrete-700/50 flex items-center justify-center">
        {item.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.coverImage}
            alt={item.title}
            className="h-full w-full object-contain p-1 border-2 border-concrete-900/70"
          />
        ) : (
          <div className="text-center px-6">
            <div className="font-mono text-[0.65rem] text-concrete-700 tracking-[0.2em] uppercase">
              {item.type}
            </div>
            <div className="font-mono text-[0.65rem] text-concrete-600 mt-2">
              {item.year}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <h3 className="font-mono text-[0.75rem] font-semibold text-concrete-700 truncate">
            {item.title}
          </h3>
          <p className="mt-1 font-mono text-[0.65rem] text-concrete-600 line-clamp-2">
            {item.creator}
          </p>
          <span className="mt-1 block font-mono text-[0.6rem] text-concrete-600 tracking-wider">
            {item.year}
          </span>
        </div>
        <span className="font-mono text-[0.65rem] text-concrete-700 border border-concrete-700/70 px-3 py-1 bg-concrete-300/70 hover:text-concrete-900 transition-colors duration-150 shrink-0">
          OPEN
        </span>
      </div>
    </>
  );

  if (item.reviewSlug) {
    return (
      <Link
        href={`/shelf/${item.reviewSlug}`}
        className="concrete-card concrete-edge overflow-hidden block"
      >
        {content}
      </Link>
    );
  }

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="concrete-card concrete-edge overflow-hidden block"
      >
        {content}
      </a>
    );
  }

  return <div className="concrete-card concrete-edge overflow-hidden">{content}</div>;
}
