import type { Metadata } from 'next';
import { JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import Script from 'next/script';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { BodyShell } from '@/components/layout/BodyShell';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SAAD',
    template: '%s — SAAD',
  },
  description: 'Projects, writing, and things I care about.',
  icons: {
    icon: '/assets/c-blue.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen">
        <Script
          src="https://unpkg.com/@bayanista/sdk/dist/bayanista.min.js"
          data-project="1"
          data-api-key="bayanista_0OakFajtH71QlD-Xwe8L0Nfb7LaPYEyOHELG9PPH6y0"
          data-api-endpoint="https://bayanista-api-production.up.railway.app"
          data-auto-init
          strategy="afterInteractive"
        />
        <BodyShell>
          <Navigation />
          <main className="pt-14 min-h-screen">
            {children}
          </main>
          <Footer />
          <Analytics />
        </BodyShell>
      </body>
    </html>
  );
}
