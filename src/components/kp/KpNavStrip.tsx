'use client';

/**
 * Sibling-link strip for the KP surfaces: Birth Chart · Prashna · Transits.
 *
 * Lightweight discoverability between /kp-system, /kp/prashna, and
 * /kp/transits — not deep-link state, just pill-style links with the
 * current page highlighted.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §8
 */

import Link from 'next/link';

export type KpNavCurrent = 'system' | 'prashna' | 'transits';

const LABELS: Record<string, Record<KpNavCurrent, string>> = {
  en: { system: 'Birth Chart', prashna: 'Prashna', transits: 'Transits' },
  hi: { system: 'जन्म कुण्डली', prashna: 'प्रश्न', transits: 'गोचर' },
  ta: { system: 'ஜாதகம்', prashna: 'பிரசினா', transits: 'கோச்சாரம்' },
  te: { system: 'జాతక', prashna: 'ప్రశ్న', transits: 'గోచారం' },
  bn: { system: 'কুণ্ডলী', prashna: 'প্রশ্ন', transits: 'গোচর' },
  gu: { system: 'કુંડળી', prashna: 'પ્રશ્ન', transits: 'ગોચર' },
  kn: { system: 'ಜಾತಕ', prashna: 'ಪ್ರಶ್ನ', transits: 'ಗೋಚಾರ' },
  mai: { system: 'जन्म कुण्डली', prashna: 'प्रश्न', transits: 'गोचर' },
  mr: { system: 'जन्मकुंडली', prashna: 'प्रश्न', transits: 'गोचर' },
};

const PATHS: Record<KpNavCurrent, string> = {
  system: '/kp-system',
  prashna: '/kp/prashna',
  transits: '/kp/transits',
};

export default function KpNavStrip({
  current,
  locale,
}: {
  current: KpNavCurrent;
  locale: string;
}) {
  const labels = LABELS[locale] ?? LABELS.en;
  const items: KpNavCurrent[] = ['system', 'prashna', 'transits'];
  return (
    <nav
      aria-label="KP surface navigation"
      className="flex justify-center gap-2 flex-wrap"
    >
      {items.map((item) => {
        const isCurrent = item === current;
        const href = `/${locale}${PATHS[item]}`;
        const classes = isCurrent
          ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40 cursor-default'
          : 'bg-bg-secondary/50 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 border border-gold-primary/15';
        if (isCurrent) {
          return (
            <span
              key={item}
              aria-current="page"
              className={`px-4 py-2 rounded-full text-sm font-medium ${classes}`}
            >
              {labels[item]}
            </span>
          );
        }
        return (
          <Link
            key={item}
            href={href}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${classes}`}
          >
            {labels[item]}
          </Link>
        );
      })}
    </nav>
  );
}
