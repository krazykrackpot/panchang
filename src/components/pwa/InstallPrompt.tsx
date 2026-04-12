'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed-at';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

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
    }
    deferredPrompt.current = null;
  }, []);

  const handleDismiss = useCallback(() => {
    setShow(false);
    deferredPrompt.current = null;
    try { localStorage.setItem(DISMISS_KEY, Date.now().toString()); } catch {}
  }, []);

  useEffect(() => {
    // Already installed?
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Dismissed recently?
    try {
      const d = localStorage.getItem(DISMISS_KEY);
      if (d && Date.now() - parseInt(d) < DISMISS_DURATION) return;
    } catch {}

    // iOS detection
    const ua = navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);

    // Chrome/Edge: beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setTimeout(() => { if (deferredPrompt.current) setShow(true); }, 30000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    const installedHandler = () => setShow(false);
    window.addEventListener('appinstalled', installedHandler);

    // iOS: show manual prompt after 60s
    let iosTimer: ReturnType<typeof setTimeout>;
    if (iOS) {
      iosTimer = setTimeout(() => setShow(true), 60000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
      if (iosTimer) clearTimeout(iosTimer);
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
            {isHi ? 'देखो पंचांग इंस्टॉल करें' : 'Install Dekho Panchang'}
          </p>
          <p className="text-xs text-text-secondary truncate">
            {isIOS
              ? (isHi ? 'Share → "होम स्क्रीन पर जोड़ें" दबाएं' : 'Tap Share → "Add to Home Screen"')
              : (isHi ? 'होम स्क्रीन से तुरंत खोलें — ऑफ़लाइन भी' : 'Quick access from home screen — works offline')}
          </p>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Dismiss install prompt"
          >
            {isHi ? 'बाद में' : 'Not now'}
          </button>
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4a853] to-[#b8912e] text-[#0a0e27] text-xs font-semibold hover:shadow-lg hover:shadow-[#d4a853]/25 transition-all active:scale-95"
            >
              {isHi ? 'इंस्टॉल' : 'Install'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
