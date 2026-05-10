// src/app/[locale]/horoscope/[rashi]/RashiArticle.tsx

import { RASHI_EDITORIAL } from '@/lib/horoscope/rashi-editorial';
import type { LocaleText } from '@/types/panchang';

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

interface Props {
  rashiId: number;
  vedicName: string;
  westernName: string;
  locale: string;
}

export function RashiArticle({ rashiId, vedicName, westernName, locale }: Props) {
  const editorial = RASHI_EDITORIAL[rashiId];
  if (!editorial) return null;

  const isHi = locale === 'hi' || locale === 'mai' || locale === 'mr' || locale === 'sa';
  const h2 = isHi
    ? `${vedicName} राशि  –  व्यक्तित्व और लक्षण`
    : `About ${westernName} (${vedicName})  –  Personality & Traits`;

  return (
    <section className="mt-12 space-y-6 max-w-3xl mx-auto px-4">
      <h2 className="text-xl font-semibold text-gold-light">{h2}</h2>
      <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
        <p>{tl(editorial.personality, locale)}</p>
        <p>{tl(editorial.rulerInfluence, locale)}</p>
        <p>{tl(editorial.elementTraits, locale)}</p>
        <p>{tl(editorial.strengthsWeaknesses, locale)}</p>
        <p>{tl(editorial.compatibility, locale)}</p>
      </div>
    </section>
  );
}
