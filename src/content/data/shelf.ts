import { ShelfItem } from '@/types/content';

export const shelf: ShelfItem[] = [
  {
    id: 'still-life',
    title: 'Still Life',
    creator: 'Jia Zhangke',
    type: 'movie',
    year: 2006,
    consumedOn: '2025',
    coverImage: 'https://images.squarespace-cdn.com/content/5b18735a3917ee20d18a2117/1600186296590-SPQYCE4TH2G3PSUEMBO8/stilllife_poster_lrg.jpg?format=1500w&content-type=image%2Fjpeg',
    reviewSlug: 'still-life',
    tags: [],
  },
] satisfies ShelfItem[];
