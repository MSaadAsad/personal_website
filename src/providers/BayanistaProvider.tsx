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
        projectId: '1',
        apiKey: 'bayanista_zWHE1jWA7NrU423GB6AL4p3QOEnu2-TPS1PWk_oAUxc',
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
