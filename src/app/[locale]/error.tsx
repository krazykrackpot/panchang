'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
// Round 3 R3-UI-2 + Gemini #167 — use the canonical Locale union from
// @/lib/i18n/config. `sa` (Sanskrit) is RETIRED; the proxy 301-redirects
// `/sa/*` → `/en/*` so it never reaches this boundary. `mr` (Marathi)
// was restored May 2026. `COPY[locale] ?? COPY.en` covers any slip.
import type { Locale } from '@/lib/i18n/config';

// Locale-aware top-level error boundary. Was hardcoded English even
// though the route lives at /[locale]/. Reuses the same COPY shape as
// RouteError.tsx + adds a Jyotish-flavoured description for the
// panchang-poetic top-level message.

interface ErrorCopy {
  heading: string;
  description: string;
  tryAgain: string;
}

const COPY: Record<Locale, ErrorCopy> = {
  en: {
    heading: 'Something Went Wrong',
    description: 'A celestial disturbance has occurred. The calculations could not be completed at this time.',
    tryAgain: 'Try Again',
  },
  hi: {
    heading: 'कुछ गलत हो गया',
    description: 'एक खगोलीय व्यवधान हुआ है। इस समय गणना पूरी नहीं की जा सकी।',
    tryAgain: 'पुनः प्रयास करें',
  },
  ta: {
    heading: 'ஏதோ தவறு நடந்தது',
    description: 'வான இடையூறு ஏற்பட்டது. இந்த நேரத்தில் கணக்கீடுகள் முடிக்கப்பட முடியவில்லை.',
    tryAgain: 'மீண்டும் முயற்சி',
  },
  te: {
    heading: 'ఏదో పొరపాటు జరిగింది',
    description: 'ఖగోళ ఆటంకం ఏర్పడింది. ఈ సమయంలో గణనలు పూర్తి చేయలేకపోయాము.',
    tryAgain: 'మళ్లీ ప్రయత్నించండి',
  },
  bn: {
    heading: 'কিছু ভুল হয়েছে',
    description: 'একটি জ্যোতির্বৈজ্ঞানিক বিঘ্ন ঘটেছে। এই মুহূর্তে গণনা সম্পূর্ণ করা যায়নি।',
    tryAgain: 'আবার চেষ্টা করুন',
  },
  gu: {
    heading: 'કંઈક ખોટું થયું',
    description: 'એક ખગોળીય વિક્ષેપ થયો છે. હાલ ગણતરી પૂર્ણ થઈ શકી નથી.',
    tryAgain: 'ફરી પ્રયાસ કરો',
  },
  kn: {
    heading: 'ಏನೋ ತಪ್ಪಾಗಿದೆ',
    description: 'ಖಗೋಳ ಅಡಚಣೆ ಸಂಭವಿಸಿದೆ. ಈ ಸಮಯದಲ್ಲಿ ಲೆಕ್ಕಾಚಾರಗಳು ಪೂರ್ಣಗೊಳಿಸಲಾಗಲಿಲ್ಲ.',
    tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
  },
  mai: {
    heading: 'किछु गलत भॅ गेल',
    description: 'खगोलीय बाधा भेल अछि। एखन गणना पूर्ण नहि भॅ सकल।',
    tryAgain: 'फेर सँ कोशिश करू',
  },
  mr: {
    heading: 'काहीतरी चुकले',
    description: 'खगोलीय अडथळा उद्भवला आहे. या क्षणी गणना पूर्ण होऊ शकली नाही.',
    tryAgain: 'पुन्हा प्रयत्न करा',
  },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const localeRaw = useLocale();
  const locale = localeRaw as Locale;
  const t = COPY[locale] ?? COPY.en;

  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto" aria-hidden="true">
            <circle cx="40" cy="40" r="38" stroke="url(#errGrad)" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M40 20v24M40 52v4" stroke="#d4a853" strokeWidth="3" strokeLinecap="round" />
            <defs>
              <linearGradient id="errGrad" x1="0" y1="0" x2="80" y2="80">
                <stop stopColor="#f0d48a" />
                <stop offset="1" stopColor="#8a6d2b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-semibold text-text-primary mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t.heading}
        </h1>

        <p className="text-text-secondary mb-8 leading-relaxed">
          {t.description}
        </p>

        <button
          onClick={reset}
          className="px-6 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-lg hover:from-gold-primary hover:to-gold-light transition-all duration-300"
        >
          {t.tryAgain}
        </button>
      </div>
    </div>
  );
}
