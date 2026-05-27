'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistrar() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') return;

    let intervalId: ReturnType<typeof setInterval> | undefined;

    const onControllerChange = () => {
      window.location.reload();
    };

    // Prefetch 7 days of panchang for offline access once we have a location.
    // No Asia/Kolkata fallback — without a real IANA timezone the offline
    // panchang would render with wrong sunrise/sunset/tithi boundaries for
    // anyone outside India. Skip prefetch until the location store has both
    // coords AND a resolved timezone (per CLAUDE.md "Timezone from
    // coordinates only — never use browser/OS timezone").
    const triggerPanchangPrefetch = () => {
      try {
        const stored = localStorage.getItem('location-store');
        if (!stored) return;
        const state = JSON.parse(stored)?.state;
        if (!state?.lat || !state?.lng || !state?.timezone) return;
        navigator.serviceWorker.controller?.postMessage({
          type: 'PREFETCH_PANCHANG',
          lat: state.lat,
          lng: state.lng,
          timezone: state.timezone,
        });
      } catch (err) {
        console.error('[ServiceWorker] prefetch payload build failed:', err);
      }
    };

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Check for updates periodically (every 60 min)
      intervalId = setInterval(() => reg.update(), 60 * 60 * 1000);

      // PWA offline panchang: prefetch 7 days once SW is active and we have a location
      if (navigator.serviceWorker.controller) {
        triggerPanchangPrefetch();
      } else {
        navigator.serviceWorker.addEventListener('controllerchange', triggerPanchangPrefetch, { once: true });
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available  –  show update banner
            setUpdateAvailable(true);
          }
        });
      });
    }).catch((err) => {
      console.error('[ServiceWorker] Registration failed:', err);
    });

    // Reload when new SW takes control
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      if (intervalId) clearInterval(intervalId);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
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
