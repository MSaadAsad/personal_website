import { Container } from '@/components/layout/Container';
import { ShelfGrid } from '@/components/shelf/ShelfGrid';
import { shelf } from '@/content/data/shelf';

export const metadata = {
  title: 'Shelf',
  description: 'Books, movies, and albums that shaped my thinking.',
};

export default function ShelfPage() {
  const sortedShelf = [...shelf]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aDate = a.item.consumedOn ? Date.parse(a.item.consumedOn) : NaN;
      const bDate = b.item.consumedOn ? Date.parse(b.item.consumedOn) : NaN;

      const aHasDate = Number.isFinite(aDate);
      const bHasDate = Number.isFinite(bDate);

      if (aHasDate && bHasDate) {
        return bDate - aDate;
      }

      if (aHasDate) {
        return -1;
      }

      if (bHasDate) {
        return 1;
      }

      return a.index - b.index;
    })
    .map(({ item }) => item);

  return (
    <Container className="pt-14 min-h-screen">
      <div className="concrete-block concrete-edge concrete-header mt-32">
        <div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            SHELF
          </h1>
          <div className="section-divider" />
          <p className="mt-3 text-base text-concrete-700 font-mono max-w-2xl leading-relaxed">
            You are what you eat. This is what I have been consuming recently.
          </p>
        </div>
      </div>
      <div className="concrete-block concrete-edge">
        <ShelfGrid items={sortedShelf} />
      </div>
    </Container>
  );
}
