import type { Metadata } from 'next';
import ProvinceComparison from './ProvinceComparison';
import './compare.css';
import './compare-overrides.css';

export const metadata: Metadata = {
  title: 'Compare Provinces — Naya Naqsha',
  description: 'Compare population, education, and development across a proposed Pakistan province plan.',
};

export default function ComparePage() {
  return <ProvinceComparison />;
}
