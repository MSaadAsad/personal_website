'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    Bayanista?: {
      init: (config: { projectId: string; apiKey: string; apiEndpoint: string; debug?: boolean }) => void;
      destroy: () => void;
    };
  }
}

export default function BayanistaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.Bayanista) {
      window.Bayanista.init({
        projectId: '2',
        apiKey: 'bayanista_yjeYRNY28bSS1xCYb7zCmxuQmDBJoH6_jZlUxl4cmYk',
        apiEndpoint: 'https://bayanista-api-production.up.railway.app',
        debug: true,
      });
    }
    return () => {
      window.Bayanista?.destroy();
    };
  }, []);

  return <>{children}</>;
}
