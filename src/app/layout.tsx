import type { Metadata } from 'next';
import { JetBrains_Mono, Source_Serif_4 } from 'next/font/google';

declare global {
  interface Window {
    Bayanista?: {
      init: (config: { projectId: string; apiKey?: string; apiEndpoint?: string; debug?: boolean }) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      track: (eventName: string, properties?: Record<string, any>) => void;
      reset: () => void;
      destroy: () => void;
    };
  }
}
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
          src="https://www.bayanista.com/sdk/v1/bayanista.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            window.Bayanista?.init({
              projectId: '1',
              apiKey: 'bayanista_Ce34qD_JnP8TtxUdsuGQTWCfENGDsjio3lje4a-I5mU',
              apiEndpoint: 'https://bayanista-api-production.up.railway.app',
              debug: true,
            });
          }}
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
