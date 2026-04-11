'use client';

import Script from 'next/script';

export function BayanistaScript() {
  const projectId = process.env.NEXT_PUBLIC_BAYANISTA_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_BAYANISTA_API_KEY;

  return (
    <Script
      src="https://www.bayanista.com/sdk/v1/bayanista.min.js"
      data-project="9ad3faa9-0080-469c-8b21-5a48d55d55f8"
      data-api-key="bayanista_ZZaJQ2aoPClwj-q4VaC5ILsHJvbAoKl07jWDiBhG8ws"
      data-auto-init
      strategy="afterInteractive"
      onLoad={() => window.dispatchEvent(new Event('bayanista:ready'))}
    />
  );
}
