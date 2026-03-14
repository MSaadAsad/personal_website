import type { Metadata } from 'next';
import { JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { BodyShell } from '@/components/layout/BodyShell';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'SAAD', template: '%s — SAAD' },
  description: 'Projects, writing, and things I care about.',
  icons: { icon: '/assets/c-blue.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen">
        <Script
          src="https://www.bayanista.com/sdk/v1/bayanista.min.js"
          data-project="7f87e047-3784-4f41-82a6-24bc31879e44"
          data-api-key="bay_kXq-Q8Dcp9JI_y-e2UASPKXWn9pwovKj"
          data-auto-init
          strategy="afterInteractive"
        />
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
