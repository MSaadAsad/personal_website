import type { Metadata } from 'next';
import { JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { BodyShell } from '@/components/layout/BodyShell';
import { Analytics } from '@vercel/analytics/next';
import { BayanistaScript } from '@/components/BayanistaScript';
import './globals.css';

const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'M. Saad Asad — AI, Projects & Writing', template: '%s — M. Saad Asad' },
  description: 'Personal website of M. Saad Asad. Explore projects in AI and machine learning, interactive maps, and writing on technology, history, and culture.',
  icons: { icon: '/assets/c-blue.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen">
        <BayanistaScript />
        <BodyShell>
          <Navigation />
          <main className="pt-14 min-h-screen">{children}</main>
          <Footer />
          <Analytics />
        </BodyShell>
      </body>
    </html>
  );
}
