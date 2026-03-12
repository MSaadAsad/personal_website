'use client';
import Script from 'next/script';

declare global {
  interface Window {
    Bayanista?: {
      init: (config: { projectId: string; apiKey?: string; apiEndpoint?: string; debug?: boolean }) => void;
      destroy: () => void;
    };
  }
}

export default function BayanistaProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://www.bayanista.com/sdk/v1/bayanista.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.Bayanista) {
            window.Bayanista.init({
              projectId: '1',
              apiKey: 'bayanista_Ce34qD_JnP8TtxUdsuGQTWCfENGDsjio3lje4a-I5mU',
              apiEndpoint: 'https://bayanista-api-production.up.railway.app',
              debug: true,
            });
          }
        }}
      />
      {children}
    </>
  );
}
