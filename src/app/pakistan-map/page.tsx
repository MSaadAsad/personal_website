import type { Metadata } from 'next';
import PakistanMapStudio from './PakistanMapStudio';
import './pakistan-map.css';

export const metadata: Metadata = {
  title: 'Naya Naqsha — Pakistan Province Builder',
  description: 'Colour districts and tehsils to sketch new provincial boundaries for Pakistan.',
};

export default function PakistanMapPage() {
  return <PakistanMapStudio />;
}
