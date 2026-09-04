import type { Metadata } from 'next';
import ProvinceProfile from './ProvinceProfile';
import './profile.css';

export const metadata: Metadata = { title: 'Province Profile — Naya Naqsha', description: 'A detailed profile for a proposed Pakistani province or territory.' };
export default function ProfilePage() { return <ProvinceProfile />; }
