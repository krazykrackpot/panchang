'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed-at';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    deferredPrompt.current = null;
  }, []);

  const handleDismiss = useCallback(() => {
    setShow(false);
    deferredPrompt.current = null;
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    // Check if dismissed recently
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt && Date.now() - parseInt(dismissedAt) < DISMISS_DURATION) {
        return;
      }
    } catch {
      // localStorage unavailable
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      // Delay showing the prompt by 30 seconds
      setTimeout(() => {
        if (deferredPrompt.current) {
          setShow(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Hide if app is installed
    const installedHandler = () => setShow(false);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 p-4 animate-in slide-in-from-bottom duration-500"
      role="banner"
      aria-label="Install application"
    >
      <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-secondary/80 backdrop-blur-xl border border-gold-primary/20 shadow-2xl shadow-black/40">
        {/* Icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#f0d48a] to-[#8a6d2b] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0e27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a7 7 0 0 0 0 14 3.5 3.5 0 0 1 0-7 3.5 3.5 0 0 0 0-7z" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            Install Dekho Panchang
          </p>
          <p className="text-xs text-text-secondary truncate">
            Quick access from your home screen
          </p>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Dismiss install prompt"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4a853] to-[#b8912e] text-[#0a0e27] text-xs font-semibold hover:shadow-lg hover:shadow-[#d4a853]/25 transition-all active:scale-95"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
