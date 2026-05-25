'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { isChunkLoadError, recoverFromChunkError } from '@/lib/utils/chunk-error';
// Round 3 R3-UI-2 + Gemini #167 — import the canonical Locale union from
// the i18n config (single source of truth). The config deliberately
// excludes `sa` (Sanskrit) and `mr` (Marathi): both are RETIRED locales
// (see retiredLocales in @/lib/i18n/config). The middleware
// 301-redirects /sa/* and /mr/* to /en/*, so neither reaches this
// component. The `COPY[locale] ?? COPY.en` fallback covers any
// unexpected slip-through (Lesson J).
import type { Locale } from '@/lib/i18n/config';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

// RouteError is the shared error boundary used by 8 route-specific
// wrappers (matching, learn, calendar, sign-calculator, kundali,
// kp-system, muhurta-ai, panchang) PLUS the top-level [locale]/error.tsx.
// Previously every string was hardcoded English; a Maithili / Tamil /
// Bengali / etc user saw English on every render failure. Same fix
// pattern as the Sprint 23 AuthModal — per-locale COPY map with EN
// fallback.

interface ErrorCopy {
  defaultTitle: string;
  description: string;
  tryAgain: string;
  goHome: string;
}

const COPY: Record<Locale, ErrorCopy> = {
  en: {
    defaultTitle: 'Something went wrong',
    description: 'An error occurred while loading this page. Please try again.',
    tryAgain: 'Try Again',
    goHome: 'Go Home',
  },
  hi: {
    defaultTitle: 'कुछ गलत हो गया',
    description: 'इस पृष्ठ को लोड करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    tryAgain: 'पुनः प्रयास करें',
    goHome: 'मुख्य पृष्ठ',
  },
  ta: {
    defaultTitle: 'ஏதோ தவறு நடந்தது',
    description: 'இந்தப் பக்கத்தை ஏற்றும்போது பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
    tryAgain: 'மீண்டும் முயற்சி',
    goHome: 'முகப்பு',
  },
  te: {
    defaultTitle: 'ఏదో పొరపాటు జరిగింది',
    description: 'ఈ పేజీని లోడ్ చేస్తున్నప్పుడు లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    tryAgain: 'మళ్లీ ప్రయత్నించండి',
    goHome: 'హోమ్',
  },
  bn: {
    defaultTitle: 'কিছু ভুল হয়েছে',
    description: 'এই পৃষ্ঠা লোড করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    tryAgain: 'আবার চেষ্টা করুন',
    goHome: 'মূল পৃষ্ঠা',
  },
  gu: {
    defaultTitle: 'કંઈક ખોટું થયું',
    description: 'આ પૃષ્ઠ લોડ કરતી વખતે ભૂલ આવી. કૃપા કરી ફરી પ્રયાસ કરો.',
    tryAgain: 'ફરી પ્રયાસ કરો',
    goHome: 'મુખ્ય પૃષ્ઠ',
  },
  kn: {
    defaultTitle: 'ಏನೋ ತಪ್ಪಾಗಿದೆ',
    description: 'ಈ ಪುಟವನ್ನು ಲೋಡ್ ಮಾಡುವಾಗ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    goHome: 'ಮುಖ್ಯ ಪುಟ',
  },
  mai: {
    defaultTitle: 'किछु गलत भॅ गेल',
    description: 'इ पन्ना लोड करबा मे त्रुटि भेल। कृपया फेर सँ कोशिश करू।',
    tryAgain: 'फेर सँ कोशिश करू',
    goHome: 'मुख्य पन्ना',
  },
  mr: {
    defaultTitle: 'काहीतरी चुकले',
    description: 'हे पान लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    tryAgain: 'पुन्हा प्रयत्न करा',
    goHome: 'मुख्यपृष्ठ',
  },
};

export default function RouteError({ error, reset, title }: Props) {
  const localeRaw = useLocale();
  const locale = localeRaw as Locale;
  // Lesson J — fall back to EN on any unexpected locale.
  const t = COPY[locale] ?? COPY.en;

  useEffect(() => {
    // Chunk-load errors mean the user has a tab open from a previous
    // deploy and the chunk we need has been garbage-collected. Reload
    // to fetch the current deploy's HTML + chunks. The global
    // ChunkErrorListener can't see these — React's error boundary
    // catches them inside the tree before the global handler fires.
    if (isChunkLoadError(error)) {
      const reloaded = recoverFromChunkError(`route:${title || 'Page'}`, error);
      // If reload was triggered, the page is about to unload — bail out
      // of the logging + report so we don't fire a spurious POST. If
      // reload was skipped (already attempted in this session), fall
      // through to the normal error UI so the user can see what failed.
      if (reloaded) return;
    }

    console.error(`[${title || 'Page'}] Error:`, error);
    // Best-effort report to server logs so we can diagnose without devtools access.
    try {
      void fetch('/api/client-error', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          source: title || 'Page',
          message: error?.message ?? String(error),
          digest: error?.digest,
          stack: error?.stack?.slice(0, 4000),
          url: typeof window !== 'undefined' ? window.location.href : '',
          ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          ts: new Date().toISOString(),
        }),
      }).catch(() => { /* never block UI on logging */ });
    } catch { /* never block UI on logging */ }
  }, [error, title]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xl text-gold-light font-bold mb-2">{title || t.defaultTitle}</h2>
        {/* Surface the actual error message above the fold (was hidden
            behind a "Show details" accordion — that buried the signal
            for 12+ hours during the BrihaspatiProvider regression). */}
        {error?.message ? (
          <p className="text-red-200 text-sm font-mono break-words mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-left">
            {error.message}
          </p>
        ) : (
          <p className="text-text-secondary text-sm mb-4">{t.description}</p>
        )}
        {error?.digest && (
          <p className="text-xs text-text-secondary/60 font-mono break-words mb-4">digest: {error.digest}</p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="px-5 py-2.5 rounded-lg bg-gold-primary/20 text-gold-light border border-gold-primary/30 text-sm font-medium hover:bg-gold-primary/30 transition-colors">
            {t.tryAgain}
          </button>
          <a href="/" className="px-5 py-2.5 rounded-lg border border-gold-primary/10 text-text-secondary text-sm hover:text-gold-light transition-colors">
            {t.goHome}
          </a>
        </div>
      </div>
    </div>
  );
}
