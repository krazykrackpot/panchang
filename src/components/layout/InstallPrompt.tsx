'use client';

import { useEffect, useState, useCallback } from 'react';
import { Download, X } from 'lucide-react';

/**
 * PWA Install Prompt — shows a custom "Add to Home Screen" banner
 * after the user's 2nd visit (tracked via localStorage).
 *
 * Uses the `beforeinstallprompt` event to detect when the browser
 * is ready to offer installation. Only shown on mobile/tablet or
 * desktop browsers that support PWA installation.
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Track visit count — only show after 2nd visit
    const key = 'dp-install-visits';
    const dismissKey = 'dp-install-dismissed';
    const visits = parseInt(localStorage.getItem(key) || '0', 10) + 1;
    localStorage.setItem(key, String(visits));

    // Don't show if user dismissed recently (within 7 days)
    const dismissedAt = localStorage.getItem(dismissKey);
    if (dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 7 * 24 * 60 * 60 * 1000) return;

    if (visits < 2) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (deferredPrompt as any).prompt();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { outcome } = await (deferredPrompt as any).userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      localStorage.removeItem('dp-install-visits');
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('dp-install-dismissed', String(Date.now()));
  }, []);

  if (!showBanner || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 bg-gradient-to-r from-[#1a1040] to-[#0a0e27] border border-gold-primary/25 rounded-2xl p-5 shadow-2xl shadow-gold-primary/10 animate-fade-in-up">
      <button onClick={handleDismiss} className="absolute top-3 right-3 text-text-secondary hover:text-text-primary transition-colors">
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6 text-gold-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gold-light text-sm font-bold mb-1">Install Dekho Panchang</h3>
          <p className="text-text-secondary text-xs leading-relaxed mb-3">
            Get instant access from your home screen. Works offline for Learn, Puja Vidhi, and saved charts.
          </p>
          <button
            onClick={handleInstall}
            className="w-full px-4 py-2.5 bg-gold-primary/20 border border-gold-primary/40 text-gold-light text-sm font-bold rounded-lg hover:bg-gold-primary/30 transition-colors"
          >
            Add to Home Screen
          </button>
        </div>
      </div>
    </div>
  );
}
