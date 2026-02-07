import { ShelfItem } from '@/types/content';

export const shelf: ShelfItem[] = [
  {
    id: 'power-of-ritual-prehistory',
    title: 'The Power of Ritual in Prehistory',
    creator: 'Brian Hayden',
    type: 'book',
    year: 2018,
    consumedOn: '2025',
    coverImage:
      'https://i0.wp.com/brianhaydenauthor.com/wp-content/uploads/2022/03/the-powers-of-rituals-in-prehistory.jpg?w=332&ssl=1',
    url: 'https://brianhaydenauthor.com/the-power-of-ritual-in-prehistory/',
    tags: ['archaeology', 'anthropology', 'religion', 'prehistory'],
  },
  {
    id: '200-electronica',
    title: '200% Electronica',
    creator: 'ESPRIT 空想',
    type: 'album',
    year: 2017,
    consumedOn: '2025',
    coverImage: 'https://f4.bcbits.com/img/a2618300680_16.jpg',
    url: 'https://open.spotify.com/album/6WgSCcRfaXuBVfM2TpV0Kl',
    tags: ['music', 'electronic', 'vaporwave'],
  },
  {
    id: 'selected-ambient-works-vol-ii',
    title: 'Selected Ambient Works Volume II',
    creator: 'Aphex Twin',
    type: 'album',
    year: 1994,
    consumedOn: '2025',
    coverImage: 'https://d1rgjmn2wmqeif.cloudfront.net/r/b/20367.jpg',
    url: 'https://open.spotify.com/album/7aNclGRxTysfh6z0d8671k',
    tags: ['music', 'ambient', 'electronic'],
  },
] satisfies ShelfItem[];
