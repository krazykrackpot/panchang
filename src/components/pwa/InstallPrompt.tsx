'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed-at';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const VISIT_COUNT_KEY = 'pwa-install-page-visits';
const MIN_VISITS_BEFORE_PROMPT = 2;

export default function InstallPrompt() {
  const locale = useLocale();
  const isHi = isDevanagariLocale(locale);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
      try { localStorage.removeItem(VISIT_COUNT_KEY); } catch { /* localStorage unavailable */ }
    }
    deferredPrompt.current = null;
  }, []);

  const handleDismiss = useCallback(() => {
    setShow(false);
    deferredPrompt.current = null;
    try { localStorage.setItem(DISMISS_KEY, Date.now().toString()); } catch { /* localStorage unavailable */ }
  }, []);

  useEffect(() => {
    // Already installed?
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Dismissed recently?
    try {
      const d = localStorage.getItem(DISMISS_KEY);
      if (d && Date.now() - parseInt(d) < DISMISS_DURATION) return;
    } catch { /* localStorage unavailable */ }

    // Track page visits — only show prompt after user has visited 2+ pages
    let visits = 0;
    try {
      visits = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10) + 1;
      localStorage.setItem(VISIT_COUNT_KEY, String(visits));
    } catch { /* localStorage unavailable */ }

    const hasEnoughVisits = visits >= MIN_VISITS_BEFORE_PROMPT;

    // iOS detection
    const ua = navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);

    // Chrome/Edge: beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      // Show immediately if user has visited enough pages, otherwise wait
      if (hasEnoughVisits) {
        setShow(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    const installedHandler = () => setShow(false);
    window.addEventListener('appinstalled', installedHandler);

    // iOS: show manual prompt after enough visits (no beforeinstallprompt on iOS)
    if (iOS && hasEnoughVisits) {
      setShow(true);
    }

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
      <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#111633]/95 backdrop-blur-xl border border-gold-primary/25 shadow-2xl shadow-black/50">
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
            {tl({ en: 'Install Dekho Panchang', hi: 'देखो पंचांग इंस्टॉल करें', sa: 'देखो पंचांग इंस्टॉल करें' }, locale)}
          </p>
          <p className="text-xs text-text-secondary truncate">
            {isIOS
              ? tl({ en: 'Tap Share → "Add to Home Screen"', hi: 'Share → "होम स्क्रीन पर जोड़ें" दबाएं', sa: 'Share → "होम स्क्रीन पर जोड़ें" दबाएं' }, locale)
              : tl({ en: 'Quick access from home screen — works offline', hi: 'होम स्क्रीन से तुरंत खोलें — ऑफ़लाइन भी', sa: 'होम स्क्रीन से तुरंत खोलें — ऑफ़लाइन भी' }, locale)}
          </p>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Dismiss install prompt"
          >
            {tl({ en: 'Not now', hi: 'बाद में', sa: 'बाद में' }, locale)}
          </button>
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4a853] to-[#b8912e] text-[#0a0e27] text-xs font-semibold hover:shadow-lg hover:shadow-[#d4a853]/25 transition-all active:scale-95"
            >
              {tl({ en: 'Install', hi: 'इंस्टॉल', sa: 'इंस्टॉल' }, locale)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
