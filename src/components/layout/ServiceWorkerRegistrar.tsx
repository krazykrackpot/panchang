'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistrar() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') return;

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Check for updates periodically (every 60 min)
      setInterval(() => reg.update(), 60 * 60 * 1000);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available — show update banner
            setUpdateAvailable(true);
          }
        });
      });
    }).catch(() => {});

    // Reload when new SW takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 bg-bg-secondary border border-gold-primary/20 rounded-xl p-4 shadow-xl animate-fade-in-up">
      <p className="text-sm text-text-primary mb-3">A new version of Dekho Panchang is available.</p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            navigator.serviceWorker.getRegistration().then((reg) => {
              reg?.waiting?.postMessage('SKIP_WAITING');
            });
          }}
          className="flex-1 px-3 py-1.5 bg-gold-primary/15 text-gold-light text-sm font-medium rounded-lg hover:bg-gold-primary/25 transition-colors"
        >
          Update Now
        </button>
        <button
          onClick={() => setUpdateAvailable(false)}
          className="px-3 py-1.5 text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  );
}
