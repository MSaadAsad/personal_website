'use client';

import Script from 'next/script';

export function BayanistaScript() {
  return (
    <Script
      src="https://www.bayanista.com/sdk/v1/bayanista.min.js"
      data-project="7f87e047-3784-4f41-82a6-24bc31879e44"
      data-api-key="bayanista_H0AT73ICH_dtd49MacAAXurJbOaSu5MlZ3wrYVrtQvI"
      data-auto-init
      strategy="afterInteractive"
      onLoad={() => window.dispatchEvent(new Event('bayanista:ready'))}
    />
  );
}
