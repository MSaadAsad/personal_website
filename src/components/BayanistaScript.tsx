'use client';

import Script from 'next/script';

export function BayanistaScript() {
  const projectId = process.env.NEXT_PUBLIC_BAYANISTA_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_BAYANISTA_API_KEY;

  return (
    <Script
      src="https://www.bayanista.com/sdk/v1/bayanista.min.js"
      data-project={projectId}
      data-api-key={apiKey}
      data-auto-init
      strategy="afterInteractive"
      onLoad={() => window.dispatchEvent(new Event('bayanista:ready'))}
    />
  );
}
