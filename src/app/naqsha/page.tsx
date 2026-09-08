import type { Metadata } from 'next';
import PakistanMapStudio from '../pakistan-map/PakistanMapStudio';
import '../pakistan-map/pakistan-map.css';

export const metadata: Metadata = {
  title: 'Naya Naqsha | Redraw Pakistan’s Provinces',
  description:
    'Draw new provincial boundaries, compare demographic and socioeconomic outcomes, and share your map.',
  alternates: {
    canonical: 'https://www.msaadasad.com/naqsha',
  },
  openGraph: {
    title: 'Naya Naqsha | Redraw Pakistan’s Provinces',
    description:
      'Draw new provincial boundaries, compare demographic and socioeconomic outcomes, and share your map.',
    url: 'https://www.msaadasad.com/naqsha',
    siteName: 'Saad Asad',
    type: 'website',
    images: [
      {
        url: 'https://www.msaadasad.com/assets/projects/naya-naqsha/cover.png',
        width: 1520,
        height: 1984,
        alt: 'Naya Naqsha regional proposal map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naya Naqsha | Redraw Pakistan’s Provinces',
    description:
      'Draw new provincial boundaries, compare demographic and socioeconomic outcomes, and share your map.',
    images: ['https://www.msaadasad.com/assets/projects/naya-naqsha/cover.png'],
  },
};

export default function ShortPakistanMapPage() {
  return <PakistanMapStudio />;
}
