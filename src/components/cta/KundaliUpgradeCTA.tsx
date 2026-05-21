'use client';

import { Link } from '@/lib/i18n/navigation';
import { Sparkles } from 'lucide-react';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/types/panchang';

interface Props {
  rashiName: string;      // e.g. "Tula" or "तुला"
  locale: string;
}

/**
 * Targeted CTA on horoscope pages: "This horoscope is Moon-sign only.
 * Your full kundali reveals 144 yogas, dashas, doshas..."
 * Links directly to /kundali.
 */
export default function KundaliUpgradeCTA({ rashiName, locale }: Props) {
  const isHi = isDevanagariLocale(locale as Locale);
  const hf = getHeadingFont(locale as Locale);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] border border-gold-primary/20 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="text-gold-light text-base font-bold mb-1.5" style={hf}>
            {isHi
              ? `यह राशिफल केवल ${rashiName} चन्द्र राशि पर आधारित है`
              : `This horoscope is based on ${rashiName} Moon sign only`}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            {isHi
              ? 'आपकी पूर्ण जन्म कुण्डली 144 योगों, दशा समयरेखा, मंगल दोष, साढ़े साती, शद्बल, और व्यक्तिगत उपायों को उजागर करती है। जन्म तिथि, समय और स्थान दर्ज करें।'
              : 'Your full birth chart reveals 144 yogas, dasha timeline, Mangal Dosha, Sade Sati, Shadbala strength scores, and personalised remedies. Enter your birth date, time, and place.'}
          </p>
          <Link
            href="/kundali"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light text-sm font-bold hover:bg-gold-primary/25 hover:border-gold-primary/50 transition-all"
          >
            {isHi ? 'निःशुल्क कुण्डली बनाएं' : 'Generate Free Kundali'}
            <span className="text-gold-primary">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
