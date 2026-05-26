'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { isChunkLoadError, recoverFromChunkError, hardReload } from '@/lib/utils/chunk-error';
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
  /** Chunk-load errors only — shown after the auto-recovery loop-guard. */
  chunkTitle: string;
  chunkDescription: string;
  chunkRefresh: string;
  showTechnical: string;
}

const COPY: Record<Locale, ErrorCopy> = {
  en: {
    defaultTitle: 'Something went wrong',
    description: 'An error occurred while loading this page. Please try again.',
    tryAgain: 'Try Again',
    goHome: 'Go Home',
    chunkTitle: 'We need to refresh to load the latest version',
    chunkDescription: 'The app was updated since you opened this page. A quick refresh will pick up the new version.',
    chunkRefresh: 'Refresh & continue',
    showTechnical: 'Show technical details',
  },
  hi: {
    defaultTitle: 'कुछ गलत हो गया',
    description: 'इस पृष्ठ को लोड करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    tryAgain: 'पुनः प्रयास करें',
    goHome: 'मुख्य पृष्ठ',
    chunkTitle: 'नवीनतम संस्करण लोड करने के लिए पुनः लोड करें',
    chunkDescription: 'आपके इस पृष्ठ को खोलने के बाद ऐप अपडेट हुआ है। एक त्वरित रिफ्रेश नया संस्करण लोड कर देगा।',
    chunkRefresh: 'रिफ्रेश करें और जारी रखें',
    showTechnical: 'तकनीकी विवरण दिखाएं',
  },
  ta: {
    defaultTitle: 'ஏதோ தவறு நடந்தது',
    description: 'இந்தப் பக்கத்தை ஏற்றும்போது பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
    tryAgain: 'மீண்டும் முயற்சி',
    goHome: 'முகப்பு',
    chunkTitle: 'புதிய பதிப்பைப் ஏற்ற புதுப்பிக்க வேண்டும்',
    chunkDescription: 'நீங்கள் இந்தப் பக்கத்தைத் திறந்த பிறகு பயன்பாடு புதுப்பிக்கப்பட்டது. ஒரு விரைவான புதுப்பிப்பு புதிய பதிப்பை ஏற்றும்.',
    chunkRefresh: 'புதுப்பித்து தொடரவும்',
    showTechnical: 'தொழில்நுட்ப விவரங்களைக் காட்டு',
  },
  te: {
    defaultTitle: 'ఏదో పొరపాటు జరిగింది',
    description: 'ఈ పేజీని లోడ్ చేస్తున్నప్పుడు లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    tryAgain: 'మళ్లీ ప్రయత్నించండి',
    goHome: 'హోమ్',
    chunkTitle: 'తాజా వెర్షన్ లోడ్ చేయడానికి రిఫ్రెష్ చేయండి',
    chunkDescription: 'మీరు ఈ పేజీని తెరిచిన తర్వాత యాప్ నవీకరించబడింది. వేగవంతమైన రిఫ్రెష్ కొత్త వెర్షన్‌ను లోడ్ చేస్తుంది.',
    chunkRefresh: 'రిఫ్రెష్ చేసి కొనసాగించండి',
    showTechnical: 'సాంకేతిక వివరాలు చూపించు',
  },
  bn: {
    defaultTitle: 'কিছু ভুল হয়েছে',
    description: 'এই পৃষ্ঠা লোড করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    tryAgain: 'আবার চেষ্টা করুন',
    goHome: 'মূল পৃষ্ঠা',
    chunkTitle: 'সর্বশেষ সংস্করণ লোড করতে রিফ্রেশ করুন',
    chunkDescription: 'আপনি এই পৃষ্ঠাটি খোলার পরে অ্যাপটি আপডেট হয়েছে। একটি দ্রুত রিফ্রেশ নতুন সংস্করণ লোড করবে।',
    chunkRefresh: 'রিফ্রেশ করে চালিয়ে যান',
    showTechnical: 'প্রযুক্তিগত বিবরণ দেখান',
  },
  gu: {
    defaultTitle: 'કંઈક ખોટું થયું',
    description: 'આ પૃષ્ઠ લોડ કરતી વખતે ભૂલ આવી. કૃપા કરી ફરી પ્રયાસ કરો.',
    tryAgain: 'ફરી પ્રયાસ કરો',
    goHome: 'મુખ્ય પૃષ્ઠ',
    chunkTitle: 'નવીનતમ સંસ્કરણ લોડ કરવા માટે રિફ્રેશ કરો',
    chunkDescription: 'તમે આ પૃષ્ઠ ખોલ્યા પછી ઍપ અપડેટ થઈ છે. ઝડપી રિફ્રેશ નવું સંસ્કરણ લોડ કરશે.',
    chunkRefresh: 'રિફ્રેશ કરો અને ચાલુ રાખો',
    showTechnical: 'તકનીકી વિગતો બતાવો',
  },
  kn: {
    defaultTitle: 'ಏನೋ ತಪ್ಪಾಗಿದೆ',
    description: 'ಈ ಪುಟವನ್ನು ಲೋಡ್ ಮಾಡುವಾಗ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    goHome: 'ಮುಖ್ಯ ಪುಟ',
    chunkTitle: 'ಇತ್ತೀಚಿನ ಆವೃತ್ತಿ ಲೋಡ್ ಮಾಡಲು ರಿಫ್ರೆಶ್ ಮಾಡಿ',
    chunkDescription: 'ನೀವು ಈ ಪುಟ ತೆರೆದ ನಂತರ ಅಪ್ಲಿಕೇಶನ್ ನವೀಕರಿಸಲ್ಪಟ್ಟಿದೆ. ತ್ವರಿತ ರಿಫ್ರೆಶ್ ಹೊಸ ಆವೃತ್ತಿಯನ್ನು ಲೋಡ್ ಮಾಡುತ್ತದೆ.',
    chunkRefresh: 'ರಿಫ್ರೆಶ್ ಮಾಡಿ ಮುಂದುವರಿಸಿ',
    showTechnical: 'ತಾಂತ್ರಿಕ ವಿವರಗಳನ್ನು ತೋರಿಸು',
  },
  mai: {
    defaultTitle: 'किछु गलत भॅ गेल',
    description: 'इ पन्ना लोड करबा मे त्रुटि भेल। कृपया फेर सँ कोशिश करू।',
    tryAgain: 'फेर सँ कोशिश करू',
    goHome: 'मुख्य पन्ना',
    chunkTitle: 'नवीनतम संस्करण लोड करबाक लेल रिफ्रेश करू',
    chunkDescription: 'अहाँक एहि पन्नाक खोलबाक बाद ऐप अद्यतन भेल अछि। एक त्वरित रिफ्रेश नव संस्करण आनत।',
    chunkRefresh: 'रिफ्रेश करू आ आगाँ बढ़ू',
    showTechnical: 'तकनीकी विवरण देखाउ',
  },
  mr: {
    defaultTitle: 'काहीतरी चुकले',
    description: 'हे पान लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    tryAgain: 'पुन्हा प्रयत्न करा',
    goHome: 'मुख्यपृष्ठ',
    chunkTitle: 'नवीनतम आवृत्ती लोड करण्यासाठी रिफ्रेश करा',
    chunkDescription: 'तुम्ही हे पान उघडल्यापासून ॲप अपडेट झाले आहे. एक त्वरित रिफ्रेश नवीन आवृत्ती लोड करेल.',
    chunkRefresh: 'रिफ्रेश करा आणि सुरू ठेवा',
    showTechnical: 'तांत्रिक तपशील दाखवा',
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

  // Chunk-load errors get a separate, friendlier UI. The auto-recovery
  // already tried once; if we're still rendering this, it means either
  // the loop-guard fired or recovery couldn't run. Either way, do NOT
  // show the user the raw chunk URL / module ID — that's developer-
  // facing garbage. Show a clear "refresh to continue" path instead,
  // and stash the technical details behind a disclosure for support.
  const isChunk = isChunkLoadError(error);

  if (isChunk) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </div>
          <h2 className="text-xl text-gold-light font-bold mb-2">{t.chunkTitle}</h2>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">{t.chunkDescription}</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => { void hardReload(); }}
              className="px-5 py-2.5 rounded-lg bg-gold-primary text-bg-primary font-semibold text-sm hover:bg-gold-light transition-colors shadow-lg shadow-gold-primary/20"
            >
              {t.chunkRefresh}
            </button>
            <a href="/" className="px-5 py-2.5 rounded-lg border border-gold-primary/10 text-text-secondary text-sm hover:text-gold-light transition-colors">
              {t.goHome}
            </a>
          </div>
          {(error?.message || error?.digest) && (
            <details className="text-left text-xs text-text-secondary/60 mt-2">
              <summary className="cursor-pointer hover:text-text-secondary transition-colors py-1">
                {t.showTechnical}
              </summary>
              <div className="mt-2 px-3 py-2 rounded-lg bg-bg-secondary/30 border border-gold-primary/5">
                {error?.message && (
                  <p className="font-mono break-words text-text-secondary/70 text-[11px]">{error.message}</p>
                )}
                {error?.digest && (
                  <p className="font-mono break-words text-text-secondary/50 text-[11px] mt-1">digest: {error.digest}</p>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

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
