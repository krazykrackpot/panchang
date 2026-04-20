'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const MESSAGES: Record<string, string> = {
  en: "You're offline — some features may be unavailable",
  hi: 'आप ऑफ़लाइन हैं — कुछ सुविधाएँ उपलब्ध नहीं हो सकतीं',
  ta: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள் — சில அம்சங்கள் கிடைக்காமல் போகலாம்',
  bn: 'আপনি অফলাইনে আছেন — কিছু বৈশিষ্ট্য অনুপলব্ধ থাকতে পারে',
};

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!isOffline) return null;

  const msg = MESSAGES[locale] || (isDevanagariLocale(locale) ? MESSAGES.hi : MESSAGES.en);

  return (
    <div
      className="fixed top-16 inset-x-0 z-40 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600/90 backdrop-blur-sm text-sm text-white"
      role="alert"
      aria-live="polite"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span>{msg}</span>
    </div>
  );
}
