/**
 * Server-rendered grid of /learn/* cross-links for the 7 core Panchang
 * concepts. Mounted at the bottom of every panchang-shaped page (root,
 * date, city) to satisfy the "helpful authority" signal Google's HCU
 * looks for — panchang pages are otherwise pure data tables.
 *
 * Single source of truth so the seven slugs + their bilingual labels
 * don't drift across the three call sites. Every slug below is verified
 * present in src/app/[locale]/learn/<slug>/page.tsx — if you change a
 * /learn slug, change it here too.
 *
 * Server component: no 'use client', no hooks, no client JS. Renders
 * the same markup inside ISR pages without inflating the client bundle.
 *
 * Locale strategy: links use `/${locale}/learn/<slug>` so the visitor
 * stays in their language. For non-en/hi locales the destination is
 * noindex per the thin-coverage policy (indexable-locales.ts), but
 * users get same-locale navigation and the internal-link signal still
 * flows to the indexable EN/HI copies via canonical + hreflang.
 *
 * NOT a translated component — the 7 concept labels are bilingual
 * (en/hi) inline. Devanagari locales (hi, mr, mai) get the Hindi
 * label; others get the EN label. Matches the existing pattern in
 * /panchang/date/[date]/page.tsx so the page reads consistently.
 */
import Link from 'next/link';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import {
  Moon,
  Star,
  Sparkles,
  Clock,
  Sun,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface Concept {
  slug: string;
  en: string;
  hi: string;
  icon: typeof Moon;
  blurbEn: string;
  blurbHi: string;
}

const CONCEPTS: ReadonlyArray<Concept> = [
  {
    slug: 'tithis',
    en: 'Tithi',
    hi: 'तिथि',
    icon: Moon,
    blurbEn: 'Lunar day — 12° of Sun-Moon elongation. 30 per month.',
    blurbHi: 'चान्द्र दिवस — सूर्य-चन्द्र के बीच 12° का अन्तर। प्रति मास 30।',
  },
  {
    slug: 'nakshatras',
    en: 'Nakshatra',
    hi: 'नक्षत्र',
    icon: Star,
    // "Stellar divisions" (not "quarters") — a quarter is a Pada
    // (3°20'), a Nakshatra is the full 13°20' division.
    // Gemini PR #387 MEDIUM.
    blurbEn: 'Lunar mansion — 27 stellar divisions of 13°20\' each.',
    blurbHi: 'चान्द्र भवन — 27 तारकीय भाग, प्रत्येक 13°20\' का।',
  },
  {
    slug: 'yoga',
    en: 'Yoga',
    hi: 'योग',
    icon: Sparkles,
    blurbEn: '27 luni-solar combinations; sum of Sun+Moon ÷ 13°20\'.',
    blurbHi: '27 सूर्य-चन्द्र संयोग; (सूर्य+चन्द्र) ÷ 13°20\'।',
  },
  {
    slug: 'karanas',
    en: 'Karana',
    hi: 'करण',
    icon: Compass,
    blurbEn: 'Half-tithi (6° elongation). 11 karanas including Vishti.',
    blurbHi: 'अर्ध-तिथि (6° अन्तर)। विष्टि सहित 11 करण।',
  },
  {
    slug: 'vara',
    en: 'Vara',
    hi: 'वार',
    icon: Sun,
    blurbEn: 'Weekday with planetary lord. Derived from Julian Day.',
    blurbHi: 'वार और स्वामी ग्रह। जूलियन दिवस से निर्धारित।',
  },
  {
    slug: 'rahu-kaal',
    en: 'Rahu Kaal',
    hi: 'राहु काल',
    icon: AlertTriangle,
    blurbEn: 'Inauspicious 90-min window. Position varies by weekday.',
    blurbHi: 'अशुभ 90 मिनट का काल। वार के अनुसार स्थान बदलता है।',
  },
  {
    slug: 'muhurtas',
    en: 'Muhurta',
    hi: 'मुहूर्त',
    icon: Clock,
    blurbEn: 'Auspicious time windows for important activities.',
    blurbHi: 'महत्वपूर्ण कार्यों के लिए शुभ काल।',
  },
];

export default function LearnConceptsBlock({ locale }: { locale: string }) {
  const isDev = isDevanagariLocale(locale);
  const heading = isDev ? 'पंचांग के तत्व विस्तार से जानें' : 'Learn the Panchang elements';
  const intro = isDev
    ? 'हर शब्द के पीछे की शास्त्रीय परिभाषा, गणितीय आधार और व्यावहारिक प्रयोग।'
    : 'The classical definition, mathematical basis, and practical use behind every term shown above.';

  return (
    <section
      aria-label={heading}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gold-light mb-2">{heading}</h2>
      <p className="text-text-secondary text-sm mb-6">{intro}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CONCEPTS.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              href={`/${locale}/learn/${c.slug}` as never}
              className="group rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4 hover:border-gold-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={16} className="text-gold-primary shrink-0" />
                <span className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors">
                  {isDev ? c.hi : c.en}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isDev ? c.blurbHi : c.blurbEn}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
